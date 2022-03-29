---
layout: post
title: "Tipos para todo"
category: cpp
tags: [cpp, programacion]
---

Consejos para desarrolladores: Si un programa tiene que manejar una
entidad, por más mínima que sea, no subestimes el poder que tiene
crear un tipo de dato para esa entidad. Por ejemplo: un DNI (Documento
Nacional de Identidad) se pueden representar con un `string` o un
entero de 64 bits, pero tal vez sea mejor usar un tipo de dato propio
(ej: una clase); una coordenada X podría ser un entero, o realmente
una clase `CoordenadaX` (o un simple `typedef` de C++ como para comenzar).

**¿Ventajas?** En lenguajes de tipado estático, podemos obtener
muchísimas validaciones en tiempo de compilación. Por ejemplo,
validaciones del tipo "aquí espero un DNI, no espero cualquier
entero"; o validaciones de unidades como "aquí espero gramos, no un
double cualquiera".

No me extrañaría ver en un futuro que Java y C# adopten los
[sufijos personalizables de C++11](http://es.wikipedia.org/wiki/C%2B%2B11#Literales_definidos_por_el_usario).
Estos sufijos permiten hacer más sencillo definir literales de nuestro propios
tipos. Ejemplos:

    DNI algunDni = 14304890_dni;
    CoordenadaX posicion = 32_x;
    Width ancho = 320_width;
    Gramos peso = 10_kg + 500_g;
    Bits datosCrudos = 10010_bits;

Sí, todas son posibles expresiones de C++11 definiendo los tipos de
datos correctos y sobrecargando el `operator""`.
(Vale la pena ver la implementación del `_bits` en esta
[respuesta de StackOverflow](http://stackoverflow.com/a/7906630).)
