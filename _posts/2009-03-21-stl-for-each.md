---
layout: post
title: STL for each
date: 2009-03-21
category: cpp
tags: [cpp, programacion, algoritmo, stl]
---

Para recorrer un arreglo de C, podemos utilizar punteros.  Comenzamos
apuntando al primer elemento y frenamos una vez procesado el último
elemento:

    #include <stdio.h>

    int main()
    {
      int array[] = { 5, 3, 4, 9, 1 };
      int array_size = sizeof(array) / sizeof(int); // cantidad de elementos de "array"
      int *array_begin = array;                     // comienzo del array
      int *array_end = array+array_size;            // final del array (+un elemento)
      int *it;                                      // el iterator

      for (it = array_begin;  it != array_end;  ++it) {
        printf("%d\n", *it);
      }
      return 0;
    }

Hay que tener en cuenta que `array_end` es igual a
`&array[5]`. Sabiendo que sólo podemos acceder a los elementos desde
`array[0]` a `array[4]`, decimos que `array[5]` está más allá del
último elemento del arreglo, es decir, `&array[5]` es la posición de
memoria que ya no es parte del mismo arreglo (de ahí `it != array_end`
significa "mientras nos encontremos dentro del arreglo").

¿Cómo recorrer un
[contenedor](http://www.sgi.com/tech/stl/Container.html) de la STL? La
idea es similar, sólo que en vez de usar punteros utilizamos
iteradores, y observe como la sintaxis del `for` es exactamente la
misma. (Nota: en este caso utilizamos un
[vector](http://www.sgi.com/tech/stl/Vector.html).)

    #include <iostream>
    #include <vector>

    using namespace std;

    int main()
    {
      vector<int> array;
      array.push_back(5);
      array.push_back(3);
      array.push_back(4);
      array.push_back(9);
      array.push_back(1);

      vector<int>::iterator it;

      for (it = array.begin();  it != array.end();  ++it) {
        cout << *it << endl;
      }
      return 0;
    }

¿Cómo recorrer un contenedor STL con el algoritmo [for_each](http://www.sgi.com/tech/stl/for_each.html)?
(Nota: Lo siguiente también se puede hacer con [copy](http://www.sgi.com/tech/stl/copy.html) y
[ostream_iterator](http://www.sgi.com/tech/stl/ostream_iterator.html).)

    #include <cstdio>
    #include <vector>
    #include <algorithm>

    using namespace std;

    void print_element(int a) { cout << *it << endl; }

    int main()
    {
      vector<int> array;
      array.push_back(5);
      array.push_back(3);
      array.push_back(4);
      array.push_back(9);
      array.push_back(1);

      for_each(array.begin(), array.end(), print_element);
      return 0;
    }

La función pasada como tercer parámetro a `for_each` es llamada por cada elemento del arreglo:

    template<typename InputIterator, typename Function>
    Function for_each(InputIterator first, InputIterator last, Function f)
    {
      for (; first != last; ++first)
        f(*first);
      return f;
    }

¿Por qué `for_each` devuelve la función? Principalmente porque la
función `f` podría no ser una función! Podría ser un
[functor](http://www.sgi.com/tech/stl/functors.html) (objeto función),
es decir, una instancia de una clase que tiene sobrecargado el
`operator()` (llamada a función). Pero este tema se merece su
propio post.

¿Se puede usar el algoritmo `for_each` para los arreglos de C? Sí.

    #include <cstdio>
    #include <algorithm>

    using namespace std;

    void print_element(int a) { printf("%d\n", a); }

    int main()
    {
      int array[] = { 5, 3, 4, 9, 1 };
      int array_size = sizeof(array) / sizeof(int); // cantidad de elementos de "array"
      int *array_begin = array;                     // comienzo del array
      int *array_end = array+array_size;            // final del array (un elemento más)

      for_each(array_begin, array_end, print_element);
      return 0;
    }
