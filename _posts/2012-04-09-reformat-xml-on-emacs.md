---
layout: post
title: "Reformat XML on Emacs"
category: emacs
tags: [emacs, programming, english]
---

You can reformat XML code adding the following code in your .emacs:

    (require 'sgml-mode)

    (defun reformat-xml ()
      (interactive)
      (save-excursion
        (sgml-pretty-print (point-min) (point-max))
        (indent-region (point-min) (point-max))))

And executing `reformat-xml` in your XML buffer then.
