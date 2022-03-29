---
layout: post
title: Lambda en C++
date: 2016-06-26
category: cpp
tags: [cpp, programacion]
prettify: lang-cpp
---

C++11 proporciona funciones lambda a C++. A veces me pregunto *¿cómo
se imagina alguien que viene de C qué son las funciones lambda en
C++?*

Supongamos una estructura que puede trasladar un punto `x, y` unas
`dx, dy` unidades:

    struct Trasladar {
      int dx, dy;

      Trasladar(int du, int dv) {
        dx = du;
        dy = dv;
      }

      void aplicar(int* x, int* y) {
        (*x) += dx;
        (*y) += dy;
      }
    };

Con esta estructura podemos crear traslaciones y aplicarlas cuantas
veces queramos a un punto `x, y`:

    int main() {
      int x = 5;
      int y = 10;

      Trasladar t(2, 4);
      t.aplicar(&x, &y);
      t.aplicar(&x, &y);

      assert(x == 9);  // 9 = 5+2+2 al aplicar "t" dos veces
      assert(y == 18);
    }

En vez de `aplicar` podríamos sobrecargar el operador de llamada a
función `operator()`, entonces la estructura `Trasladar` puede ser
utilizada como una función (a nivel sintaxis):

    struct Trasladar {
      int dx, dy;

      Trasladar(int du, int dv) {
        dx = du;
        dy = dv;
      }

      void operator() (int* x, int* y) {
         //^ "operator()" no es distinto a cualquier otro nombre de
         //  función, ej: como nuestra anterior función "aplicar"
        (*x) += dx;
        (*y) += dy;
      }
    };

    int main() {
      int x = 5;
      int y = 10;

      Trasladar t(2, 4);
      t(&x, &y);
      t(&x, &y);
    //^ La única diferencia es que ahora podemos usar "t" con la
    //  misma sintaxis que una llamada a función
    }

¿Qué ventaja tiene utilizar *"la sintaxis de llamada a función"* (ej
`t(...)`) en vez de una llamada a una función miembro como
`t.aplicar(...)`?  La ventaja es que la sintaxis a llamada a función
es "más genérica" para componer otras funciones:

    template<typename T>
    void aplicar_n(int n, int* x, int* y, T t) {
      for (; n > 0; --n, ++x, ++y)
        t(x, y); // Llamar la transformación "t" para los "n" puntos
    }

Lo bueno de esta función genérica `aplicar_n` es que sirve para
cualquier "cosa" `T` que soporte la sintaxis de llamada a función:

    void mover_x_2_unidades(int* x, int *y) {
      (*x) += 2;
    }

    int main() {
      int u[] = { 1, 2, 5 };
      int v[] = { 3, 5, 2 };
      aplicar_n(3, u, v, mover_x_2_unidades);

      // O lo que sería igual a usar nuestra estructura "Trasladar"
      aplicar_n(3, u, v, Trasladar(2, 0));

      assert(u[0] == 5);
      assert(u[1] == 6);
      assert(u[2] == 9);
    }

En este punto, se dice que `Trasladar` es un
[functor](https://en.wikipedia.org/wiki/Function_object#In_C_and_C.2B.2B)
(objeto que actúa como una función). En C++11, la nueva sintaxis para
funciones lambda básicamente nos permite crear "functors" al vuelo,
anónimos, sin nombre, en la misma línea donde los necesitamos:

    aplicar_n(3, u, v,
      [](int* x, int* y) {
        (*x) += 2;
      });

El parámetro

    [](int* x, int* y) {
      (*x) += 2;
    }

Crea la estructura

    struct Lambda {

      void operator() (int* x, int* y) {
        (*x) += 2;
      }

    };

También podríamos utilizar variables del ámbito donde creamos la
"función" lambda

    int a = 2;
    aplicar_n(3, u, v,
      [a](int* x, int* y) {
        (*x) += a;
      });

Lo que crearía un "functor" como el siguiente

    struct Lambda {
      int a;

      Lambda(int a) {
        this->a = a;
      }

      void operator() (int* x, int* y) {
        (*x) += a;
      }
    };

En conclusión, la sintaxis para funciones lambdas en C++11 no es más
que una forma de crear estructuras anónimas con el `operator()`
sobrecargado.
