---
layout: post
title: Google Chrome - Always on top
date: 2011-03-27
category: tips
tags: [tips, usability, english]
---

OK, Google Chrome needs an "Always on top" option for Windows (indeed
Windows needs that option for all applications).

Installing [AutoHotKey](http://www.autohotkey.com/) and
[running this AutoHotKey script](https://gist.github.com/raw/889748/30b2d013a07cc9601f7236467467caf50fc9eb74/AlwaysOnTop.ahk),
you will be able to put any window on top (with 80% of opacity)
pressing just WinKey+O key when you've the window active. Here is the
script just for reference:

<script src="https://gist.github.com/dacap/1470122.js"></script>

Notes:

* You can change `#o::` in the first line with other key if you want
  (e.g. `#g::` will be WinKey+G key instead of WinKey+O)
* You can change 204 with other level of opacity (0 is completely
  transparent, 255 is completely opaque)

References:

* [Request about "Always on top" in Google Chrome forums](http://www.google.com/support/forum/p/Chrome/thread?tid=70d20b6ecc8110ed&hl=en)
* [Always on top with AutoHotKey](http://www.labnol.org/software/tutorials/keep-window-always-on-top/5213/)
