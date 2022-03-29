---
layout: post
title: "Todo Constexpr: Parte 1"
category: cpp
tags: [cpp, programacion]
prettify: lang-cpp
---

> Este post es la primera parte de una serie en el que hablaremos un
> poco sobre la historia de la palabra clave `const`, la aparición de
> `constexpr` (C++11), y las futuras `consteval` y `constinit`
> (C++20).

Anteriormente vimos que usar
[const en todo]({% post_url 2015-11-05-const-a-todo %})
es una buena idea para que el compilador
chequee que no estamos modificando algo que no deberíamos modificar.
Lo mismo se aplica con los
[contratos de las APIs]({% post_url 2013-11-09-contratos %}),
el compilador puede chequear que los tipos de [los argumentos y
valor de retorno de una función](https://en.wikipedia.org/wiki/Function_prototype)
coinciden al ser usada.
En una forma más general, podemos decir que un lenguaje de
programación debería permitirnos que la mayor parte de código se
ejecute y evalúe en [tiempo de compilación](https://es.wikipedia.org/wiki/Tiempo_de_compilaci%C3%B3n)
---en vez de *run-time*, [tiempo de ejecución](https://es.wikipedia.org/wiki/Tiempo_de_ejecuci%C3%B3n).

En estos días estuve haciendo una búsqueda bibliográfica sobre las palabras claves
`const` y `constexpr`, ya que existen algunas propuestas para C++20
que agregarían aún más ruido al asunto, como
[P1073r3: Immediate functions (`consteval`)](http://www.open-std.org/jtc1/sc22/wg21/docs/papers/2018/p1073r3.html)
y [P1143r3: Adding the `constinit` keyword](https://gist.github.com/EricWF/128781c188b1a4fca7581e7ea943d58b).

## Origen de la palabra clave const

<img title="The Design And Evolution of C++" src="the-design-and-evolution-of-cpp.jpg" align="right" />

Conseguí una copia del libro *The Design and Evolution of C++* de Bjarne Stroustrup,
siguiendo las recomendación del paper
[P0939r3: Direction for ISO C++](http://www.open-std.org/jtc1/sc22/wg21/docs/papers/2019/p0939r3.pdf)
para que los que quieran sumarse u oponerse a las propuestas al
[estándar de C++](http://eel.is/c++draft/), tengan una idea del cómo
y el porqué del origen del diseño de determinadas características de C++.

> Jamás podré proponer algo al estándar, pero si lo hiciera,
> sería sólo para quitar *features*, no para agregarlas.

En la sección *3.8 Constants*, Bjarne indica que el origen de `const` se remonta
a la idea de los sistemas operativos de asignar memoria de sólo
lectura o sólo escritura a los procesos. Inicialmente se proponían dos
palabras claves: `readonly` y `writeonly`, con lo cual podrían haber
sido posible escribir cosas como:

```
void f(readonly char* entrada,
       writeonly char* salida)
{
  // Se puede sólo leer datos desde "entrada", y sólo escribir en "salida".
}
```

La historia hizo que sólo `readonly` sobreviviera como la palabra
clave `const` y el cambio se adoptara en C, no sólo en C++ ---según
cuenta Bjarne, este fue su primer contacto con los estándares en el
*Bell Labs C standards group*.

> Es interesante notar que nuevos lenguajes como Rust ahora cambiaron
> la opción por defecto, haciendo que todo sea read-only, y obligando a
> usar [`mut` para las variables que se pueden modificar](https://doc.rust-lang.org/1.0.0/book/mutability.html).

Pero esto no quedó ahí. Bjarne experimentó un poco más con la palabra
clave `const` como una alternative a las macros para especificar constantes
(*tipadas* y con *scope*):

```
const int n = 100;

int main()
{
  int valores[n]; // Podemos usar "n" en expresiones constantes
}
```

En vez de:

```
#define n 100
```

Y así evitar aún más el uso del preprocesador en el lenguaje ---uno de
los objetivos de C++ es eliminar el uso del preprocesador.

## Inicialización de objetos globales

En la sección *3.11.4 Initialization of Global Objects*, Bjarne nos
recuerda cuál fue su objetivo con los tipos de datos definidos por el
usuario: poder ser utilizados en cualquier lugar donde un [tipo de dato
built-in](https://en.cppreference.com/w/cpp/language/types) puede ser usado.
Esto incluía la posibilidad de crear
variables globales del tipo `class`
(algo que [Simula](https://en.wikipedia.org/wiki/Simula) no poseía):

```
class Doble {
public:
  double valor;
  Doble(double v) : valor(v) { }
};

Doble s1 = 2;
Doble s2 = sqrt(2); // Se construye s2 llamando la función sqrt(2) en run-time
```

Aquí Bjarne explica que este tipo de inicialización no puede
realizarse completamente en tiempo de compilación ni en tiempo de
*linkeado*.  Para eso se necesita una inicialización dinámica en
*run-time* de este tipo de variables globales.

El orden de inicialización es:

1. Se inicializan todas las variables globales `static` ([static initialization](http://eel.is/c++draft/basic.start#static))
1. Se inicializan las variables globales dinámicamente ([dynamic initialization](http://eel.is/c++draft/basic.start#dynamic)):
   * la inicialización dinámica se realiza en orden sólo para variables dentro del mismo archivo ([*translation unit*](http://eel.is/c++draft/lex#separate-1)),
   * pero no se establece ningún orden para variables definidas en distintos *translation units*.
1. Se llama a la función `main()`.

Esta relajación donde "no se establece ningún orden para inicializar
variables globales definidas en distintos *translate units*" generó algunos
problemas ---explicados en la sección *3.11.4.1 Problems with Dynamic
Initialization*---.  Aunque el mismo Bjarne admite que si dos variables
globales dependen de un orden específico de inicialización, podríamos
estar frente a un "diseño pobre" de nuestro software, la misma
librería C++ sufre de esta falla con `cout`/`cin`. Un simple ejemplo:

```
#include <iostream>

class A {
public:
  A() { std::cout << "A\n"; }
};

A a;

int main() { }
```

¿Cómo sabemos que `std::cout` está inicializado si es una variable
global definida en otro *translation unit*?

> In other words, we had been bitten by the order dependency that I
> had considered "unlikely and poor design." -- Bjarne Stroustrup

## Segunda parte

En la segunda parte de este artículo ---todavía a escribirse en un
futuro incierto--- veremos cómo usar `constexpr` para unir estos dos
conceptos: variables globales que se inicializan con una evaluación de
una función en tiempo de compilación.
