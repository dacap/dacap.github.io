---
layout: page
title: HTMLEX
permalink: /programming/htmlex/
---

An old experiment which was converted in a fully functional
HTML preprocessor. This mini language (HTMLEX) is an extension
of HTML which gives you the power to use special tags with
some kind of logic (&lt;!if&gt;, &lt;!function&gt;, &lt;!include&gt;, &lt;!macro&gt;, etc.).

The aim of this project is to generate static HTML web sites using an
improved HTML extension where you can
[include other files](https://github.com/dacap/htmlex/#include),
[define functions](https://github.com/dacap/htmlex/#function),
[macros](https://github.com/dacap/htmlex/#macro),
etc. Here an example:

`template.htex` file:

    <!function mainlayout $content>
      <html>
        <body>
          <div>Header</div>
          <div class="content"><!include $content></div>
          <div>Footer</div>
        </body>
      </html>
    <!end>

`index.htex` file:

    <!include template.htex>
    <!mainlayout index-content.htex>

This is an open source project located in github:

 * [Github website](http://github.com/dacap/htmlex/)
