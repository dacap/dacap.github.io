---
layout: post
title: "Contratos"
category: dev
tags: [dev, ideas]
---

## Introducción

Este post es el desarrollo de una simple idea de un tweet que lancé
hace un mes atrás:

<blockquote class="twitter-tweet">
<p>I&#39;ve to write a post about this: with dynamic typing you get static code, with static typing you get dynamic code</p>&mdash; David Capello (@davidcapello) <a href="https://twitter.com/davidcapello/statuses/390228612919873536">October 15, 2013</a>
</blockquote>
<script async="async" src="//platform.twitter.com/widgets.js" charset="utf-8">
</script>

Traducido, eso dice algo así:

> Con el
> [tipado dinámico](http://es.wikipedia.org/wiki/Tipado_dinámico)
> obtienes código estático y con
> [tipado estático](http://es.wikipedia.org/wiki/Tipado_estático)
> obtienes código dinámico.

¿Qué quiero decir con esto? El código con tipado estático es código
que busca un *contrato* bien definido, una forma de comunicación entre
cliente y servidor. Puede ser una
[interfaz](http://es.wikipedia.org/wiki/Tipo_abstracto), o la
[signatura de una función](http://es.wikipedia.org/wiki/Signatura_%28inform%C3%A1tica%29),
o el [tipo de una variable](http://es.wikipedia.org/wiki/Tipo_de_dato), o un
[API](http://es.wikipedia.org/wiki/Interfaz_de_programaci%C3%B3n_de_aplicaciones)
completo. Todos son contratos.

Lo bueno de estos contratos es que están *ahí*, definiendo
explícitamente lo que debe cumplir un cliente. Los compiladores
chequean que todos estos contratos (tipos, cantidad de argumentos,
valores de retorno) se cumplan correctamente, y mientras más
meta-información definamos en los contratos mejor será el chequeo
estático (en tiempo de compilación).

En contrapartida, sin estos contratos, como ocurre con el tipado
dinámico y el [duck typing](http://es.wikipedia.org/wiki/Duck_typing),
estamos al horno. Perdemos el compilador, nadie chequea nada, y sólo
en runtime podemos ver cómo falla estrepitosamente nuestro programa si
el contrato no se cumple. Es una forma de programar "a lo compilador",
en vez de programadores nos convertimos en compiladores
(*¿comprogradores?*).

Al no tener compilador, tomamos su puesto y empezamos a usar el
depurador como compilador, o en el mejor de lo casos, nuestros *test
automatizados* pasan a ser el compilador.

## Ejemplo

Vamos a ver un ejemplo muy sencillo en pseudocódigo. La siguiente es
una interfaz muy simple con un método, pero el método tiene dos
argumentos y cada argumento un tipo (todo esto es información útil
para los chequeos que hace el compilador):

    inteface Logger {
      void log(int level, String message);
    }

Existe sólo una forma de usar la interfaz. Llamando el método
`Logger.log()` con dos argumentos, el primero es un entero y el
segundo una cadena de caracteres. No existe otra forma posible de usar
la interfaz. Podemos ver un ejemplo de cliente:

    void ProcesarTareas(Logger logger) {
      logger.log(0, "Comenzar a procesar tareas");

      while (tareas.pendientes()) {
        Tarea tarea = tareas.proxima();

        switch (tarea.hacer()) {
          case Exito:       logger.log(0, "Tarea con éxito");       break;
          case Advertencia: logger.log(1, "Tarea con advertencia"); break;
          case Error:       logger.log(2, "Tarea con error");       break;
        }
      }

      logger.log(0, "Finalizar");
    }

Todas las llamadas a `Logger.log()` son iguales. Un entero y una
cadena de caracteres. Si erramos en el contrato obtenemos un error de
compilación. ¡Gracias *compilador* por ofrecernos tanto!

También podemos notar que a simple vista el argumento `level` del
método `Logger.log()` indica el nivel de severidad del error, donde
cero (0) es éxito o mensajes de información, uno (1) es una
advertencia, y dos (2) es un error. Esta información está oculta en la
interfaz, y estaría bueno hacerla explícita (modificando la
interfaz). Imaginemos que cambiamos `Logger` a algo como esto:

    interface Logger {
      void info(String message);
      void warn(String message);
      void error(String message);
    }

Al compilar la función `ProcesarTareas()` de arriba obtendríamos cinco
errores. Lo bueno es que los errores se detectan en tiempo de
compilación, no necesitamos ni ejecutar el programa para saber que
estamos fallando. Podemos saber las líneas exactas donde están los
errores y cuáles son nuestras faltas en el incumplimiento del
contrato. Una versión corregida del programa podría ser:

    void ProcesarTareas(Logger logger) {
      logger.info("Comenzar a procesar tareas");

      while (tareas.pendientes()) {
        Tarea tarea = tareas.proxima();

        switch (tarea.hacer()) {
          case Exito:       logger.info("Tarea con éxito");       break;
          case Advertencia: logger.warn("Tarea con advertencia"); break;
          case Error:       logger.error("Tarea con error");      break;
        }
      }

      logger.info("Finalizar");
    }

En un rato mejoramos el diseño del programa agregando mayor
información visible (qué queremos loguear, info, warning o error), y
eliminamos constantes duplicadas sin significado por todo el programa
(los números 0, 1 y 2). Lo bueno es que esto lo hicimos sin ejecutar
el programa. Sin *test cases*. Sin tiempo de ejecución.

Si magnificamos este simple ejemplo a millones de líneas de código,
con cientos de módulos que se conectan entre sí, podemos ver una
ventaja grandísima en el uso de estos contratos entre módulos para
poder hacer [refactoring](http://es.wikipedia.org/wiki/Refactorizaci%C3%B3n)
a gran escala.

## Conclusión

Las interfaces definen contratos, pero estos contratos no son fijos,
pueden cambiar a lo largo del tiempo (y todos los programadores saben
que van a cambiar). Por suerte el compilador va a seguir chequeando
por nosotros el cumplimiento de los contratos hasta el infinito. En
definitiva, el tipado estático favorece el refactoring, porque permite
que herramientas extras (como el compilador) nos ayuden en la tarea.

> El tipado estático promueve el código dinámico.

Por otro lado, el tipado dinámico no nos ofrece ninguna mano para
modificar el código, sino todo lo contrario: promueve el código
estático. Si tocamos las interfaces no tenemos más que ejecutar todo
el programa nuevamente para chequear que no rompimos nada. En el mejor
de los casos, vamos a tener
[pruebas de cobertura](http://es.wikipedia.org/wiki/Cobertura_de_c%C3%B3digo),
pero eso raramente suele ocurrir. En el peor de los casos, no vamos a
tener ningún test, y tendremos que ejecutar toda la funcionalidad
afectada de nuestro sistema desde cero.

Mi consejo personal: Los lenguajes de tipado dinámico no ayudan a
crear grandes sistemas mantenibles/modificables/dinámicos. Al
principio pueden parecer divertidos, interesantes, y de alta
productividad, pero sólo si estamos haciendo programas *de juguete*.
Cuando lleguemos a mayores escalas, el tipado dinámico es el peor
enemigo con el que nos podemos encontrar. El peor.
