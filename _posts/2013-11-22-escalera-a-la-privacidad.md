---
layout: post
title: "Escalera a la privacidad"
category: dev
tags: [dev, ideas, seguridad]
---

> Algunos secretos sobre cómo escalar permisos en las aplicaciones
> móviles (o cómo hacerle perder toda la privacidad al
> usuario).

## Primeros pasos

1. Hacemos una aplicación que pida muy pocos permisos.
1. De alguna manera debemos conocer cuánto tiempo el usuario pasa en
   nuestra aplicación (ej: usando peticiones HTTP a un servidor
   nuestro con todos los datos del usuario, la máxima información que
   pudimos obtener con los permisos iniciales).
1. Luego, cuando sabemos que el usuario depende lo suficiente de
   nuestra aplicación (ej: tiene muchas conexiones/comunicación con
   otras personas), sacamos una actualización.
1. La actualización es una nueva versión de nuestra aplicación (tal
   vez con cero beneficio) que requiere más permisos que la versión
   original.
1. Finalmente el usuario cede cada vez más y más privacidad (en
   realidad nunca estará seguro de cuánto ofreció).

Esto son los *baby steps* de una aplicación que quiere obtener cada
vez más datos del usuario. Lo importante en realidad no es tener mucha
información, sino *algo* de información, y principalmente, la identidad
del teléfono.

Ahora, ¿qué hacemos? tal vez existan otras personas que quieran
comprar nuestra información...

## Todas las escaleras confluyen a un punto, ¿el cielo?

Ahora imaginemos que somos dueños de una empresa que compra información
de usuarios. Lo único que necesitamos es contactar a desarrolladores
de aplicaciones móviles, y ofrecerles algo de dinero por su bases de
datos. Lo interesante aquí no es la cantidad de información que tiene
cada uno de estos pequeños desarrolladores, lo importante es que
nosotros podemos reconstruir mucha más información haciendo
corresponder las identidades de los teléfonos.

Por ejemplo, si una aplicación pide la identidad del teléfono y GPS,
sabemos que ese desarrollador puede darnos las coordenadas por donde
anduvo una persona. Si otra aplicación pide la identidad del teléfono,
el propietario y acceso a fotos, sabemos que ese otro desarrollador
puede darnos fotos de determinado teléfono, y el nombre del
propietario del celular.

Si unimos los datos de ambos desarrolladores (haciendo coincidir la
"identidad del teléfono"), ya tenemos nombre de la persona,
ubicaciones por donde caminó, y su biblioteca de fotos. Y esto
comprando sólo los datos de dos aplicaciones.

> Cabe destacar que lo expuesto aquí debería ser considerado una de
> las peores prácticas en el desarrollo de software. Tal vez la menos
> ética, y tal vez debería estar penado por ley. Por lo menos hasta
> que se encuentre un caso en contra de esos check-boxes "Juro por
> Dios y la Patria que he leído la licencia". Es probable que algunos
> lectores, al comenzar el artículo, hayan dicho *"es verdad, ¡yo
> también puedo hacerlo!"*, bueno, pues para ser sincero, sí, también
> puedes hacerlo. Hasta que se termine la fiesta. (O hasta que la
> fiesta nos termine matando a todos.)
