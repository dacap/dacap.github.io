---
layout: post
title: "Forward declarations de enumerados"
category: cpp
tags: [cpp, programacion, cpp11]
---

Continuando las discusiones con los <a href="https://plus.google.com/u/0/b/111182086636270314265/111182086636270314265/posts/hk7tonfPkFj">forward declarations</a>,
podemos destacar un pequeño tipo de dato que nunca tuvo esta capacidad,
por lo menos no hasta C++11: Los _enum_erados.

Los _enum_ siempre fueron un problema en la definición de APIs.
Actualmente, si queremos usar un enumerado en una función o como
miembro de una clase, debemos tener su definición completa con
anterioridad, inclusive el listado de valores posibles que puede tomar
el enumerado.

Esto es muy sencillo de ver en el siguiente ejemplo. Imaginemos que
nuestro programa se comunica con el usuario por medio de una GUI
(ventanas, botones, controles de todo tipo). Cada control puede
recibir mensajes desde el sistema operativo, por ejemplo, si el
usuario clickea un botón, tiene sentido que recibamos el mensaje
`BotonMousePresionado`.

Aquí un enumerado con el listado de posibles mensajes que podemos recibir
(imaginemos esto en un archivo `tipo_mensaje.h`):

    enum TipoMensaje {
      AbrirVentana,
      CerrarVentana,
      BotonMousePresionado,
      TeclaPresionada
    };

En el caso de que declaremos una clase que utiliza el enumerado,
necesitamos de la definición de `TipoMensaje` completa:

    #include "tipo_mensaje.h"   // Necesitamos la definición del enumerado

    class Mensaje {
      TipoMensaje mensaje;
    public:
      // ...
    };

Inclusive aunque no utilicemos los valores posibles del enumerado, no
hay forma de desacoplarlo. Esto se debe a que según el estándar de C++,
la cantidad de memoria usada por un enumerado depende de la
implementación del compilador y del rango de valores permitidos del
enumerado. Ejemplo: Un compilador podría decidir usar un `char` en
vez de un `int` para representar nuestro `TipoMensaje`.

**¿Cuál es la desventaja?**<br/>
Debido a que el compilador decide, según reglas internas y los valores
posibles del _enum_, qué tipo de dato usar para representarlo, cada
vez que agreguemos un nuevo valor al enumerado debemos recompilar
todos los archivos que lo estaban referenciando.

**¿Cómo podemos solucionarlo?**<br/>
C++11 introduce el concepto de los "enumerados fuertemente tipados"
(strongly typed enumerations). Con lo cual podemos decidir qué
tamaño específico tiene el enumerado.

Si conocemos con anterioridad cuántos valores queremos codificar en
nuestro _enum_, podemos especificar la cantidad de memoria requerida
por el mismo. Podemos definir un enumerado que ocupe sólo 8 bits:

    enum TipoMensaje : char {
      AbrirVentana,
      CerrarVentana,
      BotonMousePresionado,
      TeclaPresionada
    }

Y si necesitamos referenciarlo:

    enum TipoMensaje : char;    // Forward declaration

    class Mensaje {
      TipoMensaje mensaje;
    public:
      // ...
    };

**¿Por qué se llaman "enumerados fuertemente tipados"?**<br/>
Ese es otro tema que lo dejo para un próximo post.

----

Referencias: [N2347](http://www.open-std.org/jtc1/sc22/wg21/docs/papers/2007/n2347.pdf) (pdf)
