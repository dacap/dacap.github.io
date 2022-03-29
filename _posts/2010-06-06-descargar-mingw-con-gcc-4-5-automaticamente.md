---
layout: post
title: Descargar MinGW con gcc 4.5 automáticamente
date: 2010-06-06
category: cpp
tags: [cpp, programacion, compilar, instalacion]
---

Este post se podría llamar:

> ¿Cómo instalar MinGW? <br />
> ¿Cómo instalar y usar gcc 4.5 en Windows? <br />
> ¿Cómo compilar programas de C o C++ en Windows? <br />
> O también, ¿puedo portar MinGW en un pendrive?

Cualquiera de los casos se responde con el siguiente archivo:
<a href="https://github.com/dacap/mingw-downloader#readme">MinGW-Downloader.zip</a>.

Los pasos a seguir son los siguientes:

1. Cree una carpeta donde descomprimir `MinGW-Downloader.zip` (por
   ejemplo, `C:\Compilers`, o `C:\GNU`, lo importante es que la
   carpeta no contenga espacios!)
2. Descomprima `MinGW-Downloader.zip` en esa carpeta
3. Ejecute el archivo `C:\Compilers\MinGW-Downloader\MinGW-4.5-Downloader.bat`
4. Espere...
5. Una vez finalizado deberá ver algunos mensajes en la pantalla
   diciéndole si tuvo éxito (SUCCESS), inclusive el script intenta
   compilar un programa en C y otro en C++.
6. Listo, ya tiene MinGW con gcc 4.5 disponible en su máquina.

Puede usar el script `Run-cmd-with-MinGW-4.5.bat` para ejecutar la
línea de comandos de Windows y tener el compilador disponible (gcc,
g++, etc.) en la variable PATH. Lo importante es que el proceso de
descarga no modifica ninguna variable de entorno suya (PATH), por lo
tanto, podría borrar la carpeta `C:\Compilers` y empezar desde cero
siempre que así lo desee.

Puede mover la carpeta `C:\Compilers\MinGW-Downloader\MinGW-4.5` a
`C:\MinGW-4.5` y borrar `C:\Compilers\MinGW-Downloader`
completamente. Si quiere tener el compilador disponible desde
cualquier aplicación (por ejemplo, desde un editor de texto o IDE),
podría agregar la ruta `C:\MinGW-4.5\bin` a su PATH.

Cabe destacar que la carpeta `MinGW-4.5`
(`C:\Compilers\MinGW-Downloader\MinGW-4.5`) y el archivo
`Run-cmd-with-MinGW-4.5.bat` los puede mover donde usted desee (por
ejemplo, llevarlos en un pen drive), sólo tenga en cuenta que para
hacer esto los dos tienen que estar en el mismo directorio
(e.j. `C:\MinGW-4.5` y `C:\Run-cmd-with-MinGW-4.5.bat`).
