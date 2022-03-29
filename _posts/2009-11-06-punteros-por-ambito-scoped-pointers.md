---
layout: post
title: Punteros por ámbito (scoped pointers)
date: 2009-11-06
category: cpp
tags: [cpp, programacion, raii, smart_pointer, leaks]
---

C++ no tiene un
[recolector de basura](http://es.wikipedia.org/wiki/Recolector_de_basura),
[aunque C++0x le va tomando el gustito](http://www.research.att.com/~bs/C++0xFAQ.html#gc-abi),
tenemos algunas opciones para liberarnos de liberar memoria, valga la
redundancia.

Imaginemos un código como el siguiente:

    #include <cstdio>

    using namespace std;

    class A {
    public:
      A()         { printf("A\n");    }
      ~A()        { printf("~A\n");   }
      void hola() { printf("hola\n"); }
    };

    int main()
    {
      A* a = new A;
      a->hola();
      return 0;
    }

El anterior programa, por más minimalista que
parezca, tiene un [memory leak](http://en.wikipedia.org/wiki/Memory_leak).
Aunque los [recursos](http://en.wikipedia.org/wiki/Resource_%28computer_science%29)
suelen ser liberados por el mismo sistema operativo al finalizar el
programa, si el proceso se ejecuta por mucho tiempo (e.j. un servicio
que se ejecuta por días, semanas o meses dentro de un servidor), los
recursos se van agotando poco a poco hasta que la computadora queda
hecha una [pasa](http://es.wikipedia.org/wiki/Pasa).

Para arreglar el leak, deberíamos escribir:

    int main()
    {
      A* a = new A;
      a->hola();
      delete a;      // Ahora sí liberamos la memoria
      return 0;
    }

**¿Cómo hacemos para liberar memoria sin llamar `delete` nosotros mismos?**
Podemos crear una clase utilitaria que haga el trabajo por nosotros en
su destructor. Por ejemplo, en el siguiente código veremos que el
`delete` es llamado en el destructor de `PunteroA`:

    class PunteroA {
      A* ptr;
    public:
      PunteroA(A* p) { ptr = p; }
      ~PunteroA()    { delete ptr; }  // en el destructor borramos 'ptr'
    };

    int main()
    {
      PunteroA a(new A);
      a->hola();          // error, "a" no es un puntero ni sobrecarga operator->
      return 0;
    }

El anterior programa nos dará un error de compilación ya que el tipo
`PunteroA` no soporta el operador flecha. Debemos agregarlo en la
definición de la clase `PunteroA`:

    class PunteroA {
      A* ptr;
    public:
      PunteroA(A* p)  { ptr = p; }
      ~PunteroA()     { delete ptr; }
      A* operator->() { return ptr; } // operador flecha para acceder al puntero
    };

    int main()
    {
      PunteroA a(new A);
      a->hola();        // ahora sí, PunteroA::operator->() nos devuelve
                        // el verdadero puntero A* y A::hola() finalmente
                        // es llamado
      return 0;
    }

**¿Cómo obtengo el `A*` desde un `PunteroA`?** Debemos definir el operador de conversión hacia `A*`:

    class PunteroA {
      A* ptr;
    public:
      PunteroA(A* p)  { ptr = p; }
      ~PunteroA()     { delete ptr; }
      A* operator->() { return ptr; }
      operator A*()   { return ptr; } // operador para castear a A*
    };

Así podemos usar un `PunteroA` en funciones que reciban un `A*`. Ejemplo:

    void func(A* a) { ... }

    int main()
    {
      PunteroA a(new A);
      func(a);
      return 0;
    }

**Generalizando:** Podemos generalizar nuestro `PunteroA` para cualquier tipo de dato:

    template<class T>
    class ScopedPointer {
      T* ptr;
    public:
      ScopedPointer(T* p) { ptr = p; }
      ~ScopedPointer()    { delete ptr; }

      operator T*()       { return ptr; }
      T* operator->()     { return ptr; }
    };

Así podemos usar el mismo `ScopedPointer` para liberar instancias de cualquier clase:

    int main()
    {
      ScopedPointer<A> a(new A);
      ScopedPointer<B> b(new B);
      a->hola();
      return 0;
    }

**¿Y si quiero liberar otro tipo de recurso?** Si el recurso no es
memoria, y es liberado con otra función en vez de `delete`, podemos
generalizar nuestro `ScopedPointer` con un nuevo parámetro de template
llamado `Destroyer`:

    struct DefaultDestroyer {
      template<class T>
      static void free(T* ptr) { delete ptr; }
    };

    template<class T, class Destroyer = DefaultDestroyer>
    class ScopedPointer {
      T* ptr;
    public:
      ScopedPointer(T* p) { ptr = p; }
      ~ScopedPointer()    { Destroyer::free(ptr); }

      operator T*()       { return ptr; }
      T* operator->()     { return ptr; }
    };

En este caso, el destructor `~ScopedPointer` llama a la función
estática `Destroyer::free`. Esta función básicamente puede hacer lo que
nosotros queramos. Podría ser útil para liberar ficheros o cualquier
otro tipo de recurso:

    struct FileDestroyer {
      static void free(FILE* ptr) { fclose(ptr); }
    };

    int main()
    {
      ScopedPointer<FILE, FileDestroyer> file(fopen("hola.txt", "rt"));
      char buf[256];
      fread(buf, 1, 256, file);
    }

**¿No existen punteros de este tipo ya implementados?**
[Boost](http://www.boost.org/) tiene su propio [scoped_ptr](http://www.boost.org/doc/libs/1_40_0/libs/smart_ptr/scoped_ptr.htm).
También existen punteros más avanzados que cuentan referencias, como los [smart pointers](http://en.wikipedia.org/wiki/C%2B%2B0x#General-purpose_smart_pointers).
