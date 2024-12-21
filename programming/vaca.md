---
layout: page
title: Visual Application Components Abstraction
permalink: /programming/vaca/
redirect_from:
  - /vaca/
---

An experimental library to program applications on Windows with C++.
Basically it's a wrapper of several Windows API functions
to create windows, controls, drawing primitives, etc.

 * [GitHub website](http://github.com/dacap/vaca)
 * [Examples](https://github.com/dacap/vaca/wiki/Examples)

## API Example

    #include <Vaca/Vaca.h>

    using namespace Vaca;

    class MainFrame : public Frame
    {
      Label label;
    public:
      MainFrame() : Frame("Vaca Example")
                  , label("Hello World!", this) {
        setLayout(new ClientLayout);
        setSize(getPreferredSize());
      }
    };

    int VACA_MAIN()
    {
      Application app;
      MainFrame frm;
      frm.setVisible(true);
      app.run();
      return 0;
    }
