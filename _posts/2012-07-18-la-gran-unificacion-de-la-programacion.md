---
layout: post
title: "La gran unificación de la programación"
category: ideas
tags: [ideas, programacion]
---

Imaginemos un mundo donde no exista código duplicado, nada. Sólo un
gran repositorio con "pedazos de lógica" Eso significa que la más
insignificante porción de lógica, por ejemplo, calcular el mínimo
entre dos números, existe una única vez codificada en un lenguaje de
programación universal al cual todos podemos acceder. Ejemplo en
pseudo-código:

    importá "el código para calcular un mínimo entre dos valores"
             y dejalo en una función que se llame "min"
    definí la variable a = min(3, 2)
    devolvé a

Así nunca nadie debería codificar nunca jamás cómo se calcula el
mínimo de dos valores. Inclusive nuestro pequeño programa se podría
dejar en el repositorio como "el calculador del mínimo entre 3 y
2". (Completamente inútil, pero podríamos dejarlo, e inclusive,
debería estar ahí, porque yo ya lo escribí aquí.)

¿Cuál es el problema? Las interfaces. Por ejemplo ¿Qué requisito
necesita nuestro "código para calcular un mínimo"? ¿Usará el operador
`<` para comparar los argumentos? ¿O el `>`? ¿Y si usamos nuestro
propio tipo de dato? ¿Podemos calcular el mínimo entre dos archivos, o
documentos, o personas, o naranjas? ¿Qué devuelve `min`, una copia de
los argumentos o una referencia? Si devuelve una copia ¿cómo crea la
copia? ¿qué es una referencia?

Los templates de C++ resuelven muchas de estas preguntas (y los
"conceptos" intentaban ser esta especificación de esta interfaz). Pero
C++ sólo anda en C++. Lo que aquí me pongo a imaginar es un lenguaje
universal, que puede ser importado y convertido a cualquier otro
lenguaje y luego interpretado o compilado a lo que sea. Es decir, un
repositorio de pseudo-código para resolver cualquier tipo de
cuestiones.

Ejemplos: Quiero un calculador de la sucesión de Fibonacci, PUM! ahí
lo tenes para Fortran. Quiero una implementación de un radio button
para Java, PAM! Ahí lo tenes. Quiero un Tetris andando con highscore y
todo en... sí, en C mandamelo, SALE CON FRITAS!

¿Existirá algún día la cero duplicación de código?

Publicado originalmente [aquí](https://plus.google.com/109465192499995663692/posts/GVGDyMjLu2o).
