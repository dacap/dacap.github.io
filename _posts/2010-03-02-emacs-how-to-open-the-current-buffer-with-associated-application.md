---
layout: post
title: "Emacs: How to open the current buffer with associated application?"
date: 2010-03-02
category: emacs
tags: [emacs]
---

The following function tries to run the application associated with
the current buffer file type (e.g. if you use this function in an
.html file, the file will be opened with your default web browser):

    (defun open-current-file-with-associated-app ()
      (interactive)
      (shell-command (concat "cmd /c \"start " (buffer-file-name) "\"")))
