---
layout: post
title: Consejos para desarrolladores de herramientas
category: dev
tags: [dev, ideas]
---

Hace unos días me preguntaron por algunos consejos que pueda ofrecer
para los desarrolladores independientes de herramientas de software
para escritorio. No se me ocurren muchas cosas pero estos son algunos
puntos:

1. Primero concentrarse en Windows, sólo porque existe la mayor
   cantidad de usuarios y puede ser el mejor *pay-off* a corto
   plazo ---y además no van a querer dar soporte en tres plataformas
   inicialmente si son realmente independientes.
1. Seguiría con macOS ---empezaría por macOS si la aplicación es de
   diseño gráfico o sonido--- y finalmente Linux.
1. Si el framework que utilizan provee soporte a estas tres
   plataformas casi de manera automática, podrían publicar para las
   tres plataformas desde el arranque de su proyecto.
1. Prefieran librerías en vez de frameworks, y envuelvan la librería
   con su propia capa. Si en el futuro necesitan cambiar la librería,
   deberán sólo cambiar la implementación debajo de esa capa, todo el
   resto del programa está a salvo y sin requerir modificaciones.
1. Si eligen un framework, tengan en cuenta que a futuro podría
   limitarlos mortalmente. Literalmente un framework puede condenar a
   un programa a no tener determinado feature o no poder arreglar un
   bug en particular. Elijan los frameworks con cuidado.
1. Necesitarán una PC con Windows ---preferentemente una Surface---
   para dar soporte apropiado a usuarios en Windows 7/10, y una Mac
   para macOS ---y una MacBook o un Magic Trackpad para dar soporte
   apropiado a eventos touch. En otras palabras: necesitarán hardware
   real para saber cómo funcionan sus programas en ese mismo
   hardware. Las máquinas virtuales no sirven para esto.
1. Recuperación de errores: Si alguien crea o diseña cosas con sus
   herramientas tengan en cuenta que los errores valen oro. Intenten
   obtener la mayor cantidad de información de cada usuario que tiene
   un error ---memory dumps, bug reports, etc. No subestimen la
   importancia de los memory dumps y .pdbs en Windows.
   Y recuerden que perder datos es lo peor que les puede pasar a sus
   usuarios ---y más cuando estos datos son *arte*. Aprovechen un crash
   para arreglar un bug.
1. Tratar de dar el mejor soporte de usuario, y de ser posible,
   centralizado ---ej: un foro propio. También dar una dirección de
   email *support@my-desktop-tool.com* podría ser bueno para tener una
   conversación privada en caso de ser necesario ---ej: para compartir
   un memory dump.
1. ¿Código fuente abierto? ¿Libre? ¿O cerrado? Hagan lo que
   quieran. Son libres de elegir la licencia que vaya mejor con
   ustedes y recuerden que no le deben nada a nadie. Sus creaciones
   son suyas y pueden hacer con ellas lo que quieran.
1. Intenten ponerse en contacto con gente que sea profesional en el
   área que maneja su programa y sigan sus consejos. Deberán aprender
   a procesar todas las ideas recibidas y crear una interfaz que se
   ajuste a sus requerimientos, y en el mejor de los casos, que los
   supere.
