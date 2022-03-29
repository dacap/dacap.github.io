---
layout: post
title: "Excepciones desde un destructor"
category: cpp
tags: [cpp, programacion, exception]
---

Hace tres días, en C++Next publicaron
[un artículo](http://cpp-next.com/archive/2012/08/evil-or-just-misunderstood/)
sobre tirar excepciones en los destructores. Hasta el mismo
[Herb Sutter anda por los comentarios](http://cpp-next.com/archive/2012/08/evil-or-just-misunderstood/comment-page-1/#comment-1958).

Para los que no saben, los destructores no deberían tirar
excepciones. Y si la clase se usa en los contenedores de la STL, las
excepciones en los destructores están completamente prohibidas. Por lo
tanto, ya existe un consenso general en donde tirar excepciones desde
un destructor es sólo una fuente de problemas.

Así, ¿qué trae de nuevo el artículo? Bueno, aunque el artículo es
interesante y lo recomiendo leer, básicamente no llega a nada. A
tener en cuenta:

1. Si tiramos una excepciones en un destructor, la excepción se
   propaga como en cualquier otra función. Se siguen llamando los
   destructores de los subobjetos (variables miembro) y se libera la
   memoria utilizada por el objeto. La excepción se propaga hasta
   algún _catch_. Aquí todo funciona bien, no quedan objetos _zombies_
   ni _memory leaks_.

2. Cuando ocurre una excepción, se destruyen los objetos que estaban
   en su ámbito y en todos los ámbitos hasta llegar al _catch_ (este
   proceso se llama _stack unwinding_). ¿Qué ocurre si en medio de
   esos objetos que se están destruyendo ocurre otra excepción? Veamos
   el siguiente ejemplo:

       class A { ... }

       class B {
       public:
         ~B() { throw 2; }
       }

       int main() {
         try {
           A a;
           B b;
           throw 1;   // Comienza el stack unwinding, los destructores
                      // se llamarán en orden: ~B y luego ~A, pero ~B tira
                      // otra excepción
         }
         catch (...) { }
       }

   La pregunta prevalece: ¿qué pasa en este caso donde `~B` tira una
   excepción en su destrucción? ¿qué excepción continúa? ¿la primera o
   la segunda que generó el destructor?

El artículo propone pensar sobre este tema y que tal vez podríamos
descartar la segunda excepción. El estándar propone resolverlo con un
`terminate` (ver §15.2 párrafo 3). Sencillamente, no se puede tirar
otra excepción en medio del _stack unwinding_.

De los comentarios de Herb Sutter podemos sacar varios puntos muy
concisos:

1. Una excepción es un error dentro de una función, y un error ocurre
   cuando las postcondiciones de la función no se pueden cumplir.
2. La postcondición de un destructor es que el objeto estará destruido
   al salir del destructor.
3. La vida del objeto termina al momento que entramos en el
   destructor, es decir, la postcondición se cumplirá de cualquier
   modo. No podemos -en medio de un destructor- decir _"eh, ok,
   esperen, este objeto no se puede destruir, cancelen todo, vayan
   para atrás"_. Esto no es posible, al salir del destructor, la
   memoria ya será liberada.
4. Entonces, ¿por qué no tirar excepciones en un destructor? Porque no
   existe posibilidad de reintento o cancelación de la operación. Una
   vez que entramos al destructor el objeto será liberado de la
   memoria de cualquier modo.
5. Podemos llegar a usar una función `b.close()` en el caso que
   necesitemos atrapar excepciones en la liberación de recursos. El
   destructor podría simplemente llamar a `this->close()` y hacer un
   _catch_ de todas las excepciones para evitar que se propaguen.
6. Él aclara que hubiera preferido destructores con
   [noexcept](http://en.cppreference.com/w/cpp/language/noexcept_spec)
   en C++11: Un modificador de funciones que especifica que el
   compilador debe chequear que al destructor realmente no se le
   escapan excepciones.

Para divertirse un poco más con todo esto, recomiendo leer:

* Ítem 16 "Writing Exception-Safe Code" en _Exceptional C++_ de Herb
  Sutter.
* Ítem 51 "Destructors, deallocation, and swap never fail" en _C++ Coding
  Standards_ de Herb Sutter y Andrei Alexandrescu.
