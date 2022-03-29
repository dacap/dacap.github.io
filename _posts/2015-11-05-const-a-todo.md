---
layout: post
title: Const a todo
category: cpp
tags: [cpp, programacion]
prettify: lang-cpp
---

Aquí algo para enseñar *el día uno* en un curso de programación. Dada la
siguiente función que suma dos enteros:

     int suma(int x, int y) {
       return x + y;
     }

¿Qué está mal con este código? Respuesta: Que permite cometer errores
como el siguiente:

     int suma(int x, int y) {
       x = 0;
       return x + y;
     }

¿Por qué podemos modificar un argumento de entrada que se supone que
no debe cambiar? Es decir, en nuestra cabeza hemos diseñado una
función, pero en código hemos escrito algo que permite equivocarnos
más de lo que debería.

Si forzamos a que un argumento sea `const` (de sólo lectura, read-only):

     int suma(const int x, const int y) {
       return x + y;
     }

Podemos detectar errores en tiempo de compilación:

     int suma(const int x, const int y) {
       x = 0; // Error de compilación porque "x" es "const"
       return x + y;
     }

En un ejemplo simple como esta función `suma` no parece tener sentido,
pero en funciones complejas, el `const` de los argumentos se propaga a
otras funciones internas y los chequeos que el compilador puede
realizar crecen exponencialmente.

> Esto nos hace recordar que los argumentos en las funciones son
> variables locales. Y como cualquier otra variable se puede modificar
> en el mismo cuerpo de la función. Por ejemplo:
>
>     void desde_i_hasta_j(int i, const int j) {
>       for (; i <= j; ++i) {
>         // Hacer algo con "i"
>       }
>     }
