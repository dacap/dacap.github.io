---
layout: post
title: Callbacks
category: cpp
tags: [cpp, programacion]
prettify: lang-cpp
---

Los viejos callbacks de C, ¿quién los recuerda? ¿nadie? ¿punteros a
una función? ¿no? Meh, no importa. Imaginemos esta interfaz:

    interface Callback {
      bool match(int valor);
    }

El método `match()` devolvería `true` si el `valor` es de interés.

En C++ se escribe lo mismo así:

    class Callback {
    public:
      virtual ~Callback() { }
      virtual bool match(int valor) = 0;
    };

Podemos tener un algoritmo que nos dé como resultado el índice del
primer ítem que <em>match</em>ea nuestro `Callback`:

    int buscar_primera_coincidencia(const int* array,
                                    int elementos,
                                    Callback* callback) {
      for (int i=0; i<elementos; ++i) {
        if (callback->match(array[i]))
          return i; // El item i es el primero en cumplir match() == true
      }
      return -1;
    }

Así podemos crear miles de implementaciones `Callback`:

    class EsCinco : public Callback {
    public:
      bool match(int valor) override {
        return (valor == 5);
      }
    };

O también:

    class DistintoDeCero : public Callback {
    public:
      bool match(int valor) override {
        return (valor != 0);
      }
    };

O mucho mejor, hacer una clase genérica:

    template<int VALOR>
    class EsIgualA : public Callback {
    public:
      bool match(int valor) override {
        return (valor == VALOR);
      }
    };

Y usarla así:

    int main() {
      int array[] = { 4, 8, 15, 16, 23, 42 };

      EsIgualA<16> igual16;
      int resultado = buscar_primera_coincidencia(array, 6, &igual16);

      assert(resultado == 3);
    }

Podríamos decir que `Callback` es algo así como interfaz
[delegate](http://en.wikipedia.org/wiki/Delegation_pattern): Alguien a
quien le derivamos parte del trabajo que `buscar_primera_coincidencia`
necesita.

Un ejemplo exactamente igual se da en la
función [qsort](http://en.cppreference.com/w/cpp/algorithm/qsort).
Sólo que la interfaz `Callback` en este caso es un puntero
a una función:

    void qsort(void*  ptr,
               size_t count,
               size_t size,
               int  (*comp)(const void*, const void*));
                     //^ Un verdadero callback: un puntero a una función

Lo que sería igual a:

    class Comp {
    public:
      virtual ~Comp() { }
      virtual int comp(const void* elementoA, const void* elementoB) = 0;
    };

    void qsort(void*  ptr,
               size_t count,
               size_t size,
               Comp*  comp);

En un próximo post vamos a ver cómo la STL utiliza conceptos similares
a callbacks y delegates en su diseño.

> Este es el primer post de una seguidilla que tengo planeada sacar
> respecto a [callbacks](http://es.wikipedia.org/wiki/Callback_%28inform%C3%A1tica%29),
> [signal programming](http://en.wikipedia.org/wiki/Signal_programming),
> [signals y slots](http://en.wikipedia.org/wiki/Signals_and_slots),
> [patrón observer](http://es.wikipedia.org/wiki/Observer_%28patr%C3%B3n_de_dise%C3%B1o%29),
> [cálculo lambda](http://es.wikipedia.org/wiki/C%C3%A1lculo_lambda#C.C3.A1lculo_lambda_y_los_lenguajes_de_programaci.C3.B3n),
> [inversión de control](http://es.wikipedia.org/wiki/Inversi%C3%B3n_de_control),
> [inyección de dependencias](http://es.wikipedia.org/wiki/Inyecci%C3%B3n_de_Dependencias), etc.
