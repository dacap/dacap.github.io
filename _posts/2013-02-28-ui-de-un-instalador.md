---
layout: post
title: "UI de un instalador"
category: dev
tags: [dev, ux, linux]
---

Intenté instalar Fedora 18. Estos son los problemas en la primera
pantalla de la instalación. (Demás está decir que tuve ganas de dejar
la instalación acá mismo.)

<img class="img-responsive" src="fedora-18.png" style="width:100%;" />

La primera pantalla (ver screenshot) muestra la selección de
lenguaje. Una lista con todos los lenguajes, y por defecto
seleccionado inglés (fair enough). Selecciono español con el mouse. No
hay problemas por ahora.

Debajo de la lista hay un texto box y un check box. No entiendo muy
bien para qué sirve el text box, y el checkbox dice *"Fijar la
distribución de teclado predeterminado para el idioma seleccionado."*
(mensaje totalmente incomprensible). Generalmente cuando instalo un
sistema operativo pienso "seguro voy a tener que configurar el
teclado". Por experiencia previa en Windows siempre hay dos cosas que
configurar: idioma y teclado, después lo demás viene cocinado (o por
lo menos es lo mínimo que espero).

Escribo algo en el text box y resulta ser que actúa como filtro del
lenguaje, como para buscar el lenguaje según escribimos. Esto tiene
tres fallas (sí, tres fallas en una misma pantalla):

1. El text box sirve para filtrar una lista que está encima de él, no
   por debajo, ¿para qué filtrar una lista que ya seleccioné con el
   mouse?  generalmente los campos de búsqueda muestran los resultados
   abajo, no arriba, inclusive una lupa dentro del text box no vendría
   nada mal, por lo menos para saber que sirve para buscar,
2. Al escribir el lenguaje, puse "spanish", pero no aparece nada, hay
   que escribir "español" (extraño, ya que en el listado se muestra
   una columna con el nombre del idioma en inglés),
3. Al intentar escribir "español" aparece "espa;ol", porque todavía no
   pude configurar el teclado.

En conclusión: tengo un text box que sirve para filtrar según el
nombre del idioma, pero necesito colocar caracteres unicode que
todavía no puedo ingresar porque no configuré el teclado, o sea, el
text box no sirve *absolutamente* para nada. ¡¿Quién demonios diseñó
esta pantalla?!

Y todavía falta el check box, que dicho sea de paso lo presioné
pensando que servía para configurar el teclado. Pero después de
clickear en *"Continuar"* comprendí el mensaje: *"Fijar el teclado
predeterminado"*. *"Fijar predeterminado"*. *"Set/use default"*.
Entonces dije *"Ah claro no, no, no, yo quiero especificar mi teclado,
no quiero uno por defecto"*, y luego no pude volver a la pantalla
anterior (no hay botón *"Volver"*). Tuve que salir de la instalación y
comenzar de nuevo.

A veces me preguntan *"¿qué tiene de malo Linux?"*. Use Debian por más
de 5 años (por línea de comandos, porque el GUI nunca me terminó de
cerrar), y ya hace muchísimo tiempo volví a Windows, ¿por qué? por
esta mentalidad endemoniada y retorcida que está detrás del diseño de
cada simple pantalla, ventana, diálogo, botón.

Si sos un programador, el entorno de Linux te puede beneficiar porque
tiene las herramientas justas para programar, de fácil acceso e
instalación, scripts, etc. Pero al tiempo que empieces a usar la
interfaz gráfica, te va a dañar el cerebro. Vas a comenzar a creer que
esas pantallas están bien diseñadas, y por lo tanto, terminarás siendo
un peor programador.
