---
layout: post
title: "Emacs: How to locate the current buffer in Windows Explorer?"
date: 2010-03-02
category: emacs
tags: [emacs]
---

You can use the following function to open the Windows Explorer in the directory of the current buffer:

    (defun locate-current-file-in-explorer ()
      (interactive)
      (cond
       ;; In buffers with file name
       ((buffer-file-name)
        (shell-command (concat "start explorer /e,/select,\"" (replace-regexp-in-string "/" "\\\\" (buffer-file-name)) "\"")))
       ;; In dired mode
       ((eq major-mode 'dired-mode)
        (shell-command (concat "start explorer /e,\"" (replace-regexp-in-string "/" "\\\\" (dired-current-directory)) "\"")))
       ;; In eshell mode
       ((eq major-mode 'eshell-mode)
        (shell-command (concat "start explorer /e,\"" (replace-regexp-in-string "/" "\\\\" (eshell/pwd)) "\"")))
       ;; Use default-directory as last resource
       (t
        (shell-command (concat "start explorer /e,\"" (replace-regexp-in-string "/" "\\\\" default-directory) "\"")))))

How it works?

* If you are visiting a buffer associated to a file (with
  buffer-file-name), the Windows Explorer is opened to focus the file
  in its directory.
* If you are in dired mode (browsing a directory inside Emacs with
  dired-mode), it will open that directory in Windows Explorer.
* If you are in eshell-mode, the current working directory will be
  opened in Windows Explorer.
* As last chance it will open the Windows Explorer in the default
  directory (where you start emacs). E.g. This can happen if you use
  this function in *scratch* buffer (which is a buffer without an
  associated file).
