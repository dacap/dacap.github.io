---
layout: post
title: Parásitos del open source
category: dev
tags: [dev, programacion, ideas]
---

El [reciente bug de OpenSSL](http://heartbleed.com/) deja al
descubierto la cultura que rodea al open source: *<del>todos</del>
muchos son unos parásitos.* ¿Cuántos proveedores de hosting habrán
dado tiempo, dinero o recursos para mejorar el código de OpenSSL?
¿Uno? ¿Dos? ¿Cien?  ¿Cuántos millones usarán servidores HTTP como
Apache sin devolver absolutamente nada a la comunidad? ¿Cuántos tienen
corriendo su negocio "de arriba"?

El software sin bugs no existe, pero si tu empresa depende de un
software X, deberías invertir *algo* en ese software. Los bugs no
desaparecen por arte de magia, sino más bien aparecen por arte de
magia. Y en este caso me alegra decir esto: La culpa no es de los
desarrolladores de OpenSSL. La culpa es de *todos los que usan* el
software y nunca pusieron un peso para nada. (Por ejemplo para montar
una buena estructura de testing automatizado que mitigue la
introducción de nuevos bugs.)

¿Cómo sería una buena cultura de open source? Que los que usen un
programa open source sepan que le *deben* algo a sus desarrolladores.
Si alguna vez pierden datos por un crash, información sensible de sus
clientes por un bug, o la vida de alguien está en riesgo por un error
en un pedazo de código abierto, la culpa es suya por usarlo y no
devolver nada a cambio.
