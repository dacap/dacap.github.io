---
layout: post
title: Improving your applications by statistics
date: 2010-03-03
category: dev
tags: [appdev, programming, english]
---

If you developed an application and published it in a website, you can
use things like google-analytics data to adjust your
application. E.g. If everybody is accessing your website with 32-bits,
24-bits and 16-bits screen resolutions, you can discard all
considerations about 8-bits modes in your application.

Things you should add to your application:

* A way to get usage data from your users. E.g. where they do click,
  how they call commands (menus, keyboard, toolbars, ribbons,
  etc.). In this way you could focus improvement in the more common
  methods to run commands.
* A way to count how many times a command was used. Maybe there are
  commands that are rarely used, these commands could be more deeper
  in menus hierarchies and without keyboard shortcut.
* A way to known systems where your application is
  running. E.g. operating system, version, screen resolution,
  etc. Improve usability in the most used platform.
* A way to known how many computers are running a specific version of
  your application. If a version is not used anymore, you can stop
  supporting it (E.g. Adding patches for a version that nobody
  uses).

All this must be done carefully, with proper check-boxes like "Do you
want to send anonymous data about your usage to improve customer
experience?" in installers, splash screens, etc.

[There are some frameworks](http://www.eclipse.org/epp/usagedata/) to
do this kind of work. Anyway you basically need:

* An HTTP server to accept packages from users (e.g. through POST
  requests). Each request should be processed by a script (in PHP,
  ASP, etc.) which should convert the received package into database
  model.
* A way to differentiate users (you could SHA1 some string like "local
  user name + pc host name + app name version"). Here I don't know if
  the IP could be a good way idea (NAT problems, etc.).
* A way to make HTTP requests from your application (firewall + proxy
  problems) of all collected usage data of the user (identified by the
  SHA1).
* A mini-program to process all the database and print some useful
  reports.
