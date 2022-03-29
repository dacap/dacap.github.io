---
layout: post
title: "Consejos para Diseñar Clases (en realidad Software)"
category: programacion
tags: [dev, ideas, programacion, cpp]
prettify: lang-cpp
---

Gracias a una pregunta que me hicieron hoy sobre algunos consejos para
diseñar clases, escribo este pequeño artículo sobre mi enfoque
personal hacia el desarrollo de software, y sobre las clases en
particular:

1. Crear un programa no se trata de crear clases, sino sólo de
   resolver un problema.

1. Un programa son instrucciones de código que manejan/transforman
   datos, y esto es siempre así, sin excepción.

1. Los datos son memoria en el disco o la memoria RAM, y pueden
   "estructurarse" con un simple un `struct`. Ejemplo:

       struct Jugador {
         char nombre[256];   //< Los primeros 256 bytes representan el nombre del jugador
         uint32_t puntaje;   //< Luego un entero de 4 bytes representan el puntaje del jugador
       };

1. El código que maneja los datos puede estar ubicado en cualquier
   lugar, pero existe una relación directa entre ese código y los
   datos que manipulan.

1. Por lo tanto siempre vamos a preferir tener el código cercanos
   a esos datos que manipula (en el mismo `.cpp`, `.h`, o `.java`, `.csharp`, etc.).
   Ejemplo:

       struct Jugador { ... };

       Jugador* crear_jugador(const char* nombre);
       void destruir_jugador(Jugador* jugador);

1. Si comenzamos a manipular los datos en cualquier lugar de nuestro
   programa comenzaremos a tener problemas a futuro para cualquier
   modificación que queramos hacer. **Mal ejemplo**:

       int main() {
         Jugador* j = crear_jugador();
         memcpy(j->nombre, "David\0", 6);   //< Código que accede a la estructura interna del Jugador
         destruir_jugador(j);
       }

   Luego al querer cambiar la estructura de nuestros datos:

       struct Jugador {
         string nombre;     //< Ahora el nombre es un std::string
         uint32_t puntaje;
       };

   Nuestro código que llamaba a `memcpy()` deja de funcionar.

1. Así es como podemos crear funciones para manipular esos datos:

       void cambiar_nombre_del_jugador(Jugador* j, const char* nuevo_nombre);
       void sumar_puntos_al_jugador(Jugador* j, uint32_t mas_puntos);

1. Pero en vez de repetir la palabra `_del_jugador`, `al_jugador`,
   etc. podríamos colocar las funciones que modifican los datos lo más
   cerca de los datos posible, dentro del `struct` mismo:

       struct Jugador {
         string nombre;
         uint32_t puntaje;

         void cambiar_nombre(const char* nuevo_nombre);
         void sumar_puntos(uint32_t mas_puntos);
       };

1. Y finalmente podríamos "ocultar" el acceso directo a los campos
   `nombre` y `puntaje` desde fuera del `struct`:

       class Jugador {    //< Esto podría ser un "struct" y no habría diferencia
       public:
         void cambiar_nombre(const char* nuevo_nombre);
         void sumar_puntos(uint32_t mas_puntos);

       private:
         string nombre;
         uint32_t puntaje;
       };

1. En esta forma tenemos funciones que modifican datos estructurados y
   que ocultan los detalles de esa estructura.

## Objetivos de las clases

Los objetivos de las clases entonces parecen ser:

1. Ocultar detalles de la estructura de los datos en memoria
1. Permitir modificar esa estructura manteniendo la misma interfaz (¿modificar menos código a futuro?)
1. Escribir menos código al evitar usar el nombre del tipo de dato
   en cada función (ej: `cambiar_algo_del_jugador`, `obtener_algo_del_jugador`, etc.)
   y al ofrecer acceso implícito a las variables miembros de la clase
   (esto es: al escribir `nombre` sabemos que hacemos referencia a `this->nombre`,
   igual que hacer `jugador->nombre` en cualquier otra función fuera de `Jugador`)

## Consejos para diseñar clases

Mi consejo es comenzar directamente con `struct`s, todos los datos
públicos, y un conjunto de funciones: funciones dentro del `struct` si
modifican esos datos, y funciones globales si son lógica que usa el
`struct`.

Empezaría usando la estructura con sus funciones y en algunos casos
accediendo a sus datos directamente. Luego si nos damos cuenta que
hacemos algo con los datos repetidamente, aparecerá la necesidad de
crear una función (dentro del `struct`) para evitar duplicar código.

A futuro (cuando el sistema se hace más complejo) colocamos todas las
variables miembro en campos `private` y también la mayor cantidad de
funciones en `private` que podamos. Toda la interfaz (y lo más pequeña
posible) en `public`. Al compilar los errores nos dirán dónde
accedemos directamente a los campos que ahoran son `private`.

Tenemos que tener en cuenta que el desarrollo de software es algo
evolutivo. Comenzaremos con el diseño más sencillo que podamos
(estructuras y funciones que modifiquen esos datos) y luego a medida
que avanzamos empezamos a ocultar más información, agregando funciones
miembro (métodos), etc.

En definitiva mi consejo sería:

1. No hagas algo excesivamente "robusto" en un principio si no sabes
   que lo que estás haciendo durará por mucho tiempo. Ej. un simple
   programa para resolver un problema pequeño tal vez no requiere de
   tanta ingeniería/arquitectura/etc.
1. Las clases aparecerán solas por necesidad de modificar datos, y las
   relaciones entre clases por las relaciones entre esos datos.
   Mientras menos relaciones/dependencias entre distintas clases, y
   jerarquías de clases tengamos, mejor.

Yo diría que el único enfoque posible es *pensar en datos* y no en
cosas/objetos del mundo real, sino más bien en *qué datos* necesitamos
para resolver el problema que tenemos que resolver.
