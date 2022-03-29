---
layout: post
title: "Un no-lenguaje de programación"
category: dev
tags: [dev, ideas, programacion]
---

¿Será la manipulación de árboles AST el futuro? En
[The Future of Programming](http://pchiusano.blogspot.co.nz/2011/12/future-of-programming.html),
Paul Chiusano habla sobre una organización del código fuente en forma
de bases de datos relacionales. En vez de editar texto, editaríamos
esta base de datos --mediante alguna buena UI supongamos--. Así todo
un nuevo conjunto de herramientas se hace posible, y lo que hoy nos
parece complicado de implementar --por ejemplo un *refactor*-- se
podría implementar como un `UPDATE` a un campo de una tabla. En otras
palabras, podríamos almacenar los
[AST](http://es.wikipedia.org/wiki/%C3%81rbol_de_sintaxis_abstracta)
en vez del texto crudo, y manipularlos directamente. Un proyecto que
apunta a esto es: [Lamdu](http://peaker.github.io/lamdu/).

Existe todo un mundo detrás de la manipulación del texto en la
programación. Somos artesanos del texto. Y con esto no me refiero
exactamente a "escritores". Sino a la cantidad de tiempo que
invertimos en cosas inútiles que no afectan al código. Por ejemplo:
espacios en blanco, tamaño de *tabs*, cantidad de columnas en la
pantalla, nuevas líneas y *enters* (CRLF vs CR vs LF), nivel de sangría,
etc. (A veces en vez de programar, siento que estoy pintando un cuadro.)

Para empeorar la situación, las reglas deben ser acordadas entre todos
los miembros del equipo, que a su vez, tienen batallas constantes
dentro de sus cabezas entre lo acordado y sus preferencias personales.

¿Por qué cuando programamos no nos podemos concentrar únicamente en la
lógica del programa? ¿Por qué debemos lidiar con todos estos problemas
sobre caracteres que *no vemos*? Y el problema no es sólo en los
editores de texto, se extiende a programas controladores de versiones
(ej: git), websites para revisar código, herramientas para formatear
el código y para buscar dentro del código (*find/grep*), etc. Si
pudiéramos desligarnos de la representación en texto, podríamos evitar
estos problemas.

La edición, navegación, presentación, comparación y control de
versiones de árboles AST abre todo un nuevo mundo de opciones que hoy
en día se nos escapa por estar preocupados en si un *tab* debe tener un
ancho de 4 u 8 espacios. Por ejemplo, la búsqueda de código duplicado
podría hacerse mediante búsqueda de árboles AST similares. Un nuevo
tipo de refactor podría buscar estos árboles y crear métodos,
funciones o clases que los agrupen automáticamente. Ya no estaríamos
manipulando texto, sino "pedazos de lógica". ¿Qué pasaría si
convirtiésemos todo el código de GitHub en árboles AST y pusiéramos a
andar este *refactor* semántico? Tal vez podríamos unir muchos cuerpos
de funciones en micro-librerías que se reutilizarían entre los
proyectos más disímiles.

En fin, por ahora veo lejos la posibilidad de reemplazar los editores
de texto. A pesar de todos los problemas que presentan, la entrada y
navegación de caracteres es demasiado ágil. También sospecho que
existen elementos psicológicos e históricos guardados en nuestros
cerebros: hemos evolucionando y crecido leyendo y escribiendo, es "a
lo que estamos acostumbrados".

> Bonus: Esto me trae a la cabeza otra pregunta, ¿los árabes
> encontrarán fácil de programar en lenguajes de programación que se
> escriben de izquierda-a-derecha? Existen
> [lenguajes que no están basados en el inglés](http://en.wikipedia.org/wiki/Non-English-based_programming_languages),
> y entre ellos
> [Qalb](http://en.wikipedia.org/wiki/Qalb_%28programming_language%29),
> un lenguaje funcional parecido a Scheme pero que se programa
> totalmente en árabe (de derecha-a-izquierda).
