---
layout: post
title: REPL y tests
category: cpp
tags: [cpp, programacion]
---

Un REPL ([Read--Eval--Print Loop](http://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop))
es un pequeño programa que lee un comando del usuario, lo interpreta,
lo evalúa, e imprime el resultado.

Este tipo de interfaces pueden usarse para: 1) tener una forma
simplificada de acceder y ejecutar funcionalidad de nuestro programa,
y 2) probar la lógica de una forma directa.

Por ejemplo, supongamos que tenemos una función `suma`:

    int suma(int x, int y) {
      return x + y;
    }

Y queremos ver que realmente esté haciendo lo que debería estar
haciendo. Una opción es hacer un programa de prueba con varios
`assert`s:

    #define _DEBUG
    #include <cassert>

    int main() {
      assert(suma(0, 0) == 0);
      assert(suma(2, 3) == 5);
      assert(suma(4, 8) == 12);
      assert(suma(2, -3) == -1);
    }

Pero supongamos que tenemos cientos de funciones, y que cada una puede
interactuar con las demás generando distintos resultados y
combinaciones. (O incluso los resultados esperados pueden no entrar en
un archivo de código fuente, ej: el resultado puede ser una imagen.)
En estos casos puede ser beneficioso tener un "script" al que se le
puedan agregar pruebas.

En C++, la forma más simple de implementar un REPL es utilizando la
función `std::getline`:

    #include <iostream>
    #include <string>
    using namespace std;

    int main() {
      string line;
      while (getline(cin, line)) {
        if (line == "exit")
          break;
      }
    }

Con este código leemos línea a línea la entrada estándar hasta que el
usuario ingrese `exit`. Ahí termina todo. Lo interesante es que
podríamos leer cada línea e intentar interpretar los comandos que se
ingresan. Una línea representaría una prueba distinta. Por ejemplo,
teniendo un archivo de texto `pruebas.txt`:

    suma 0 0 0
    suma 2 3 5
    suma 4 8 12
    suma 2 -3 -1
    exit

Podemos crear un programa que lea estas líneas, ejecute las llamadas a
`suma`, y muestre los resultados:

    #include <iostream>
    #include <sstream>
    #include <string>
    using namespace std;

    bool eval(const string& line);

    int main() {
      string line;
      while (getline(cin, line)) {
        if (!eval(line))
          break;
      }
    }

    bool eval(const string& line) {
      stringstream input(line);

      string cmd;
      input >> cmd;

      if (cmd == "exit") {
        return false;
      }
      else if (cmd == "suma") {
        int x, y, expected;
        input >> x >> y >> expected;

        int result = suma(x, y);

        cout << "suma(" << x << ", " << y << ") = "
             << result << " "
             << (result != expected ? "(FAILED) ": "(OK)")
             << endl;
      }

      return true;
    }

Así podemos ejecutar el programa por medio de la línea de comando
pasándole el archivo `pruebas.txt` como entrada estándar. Es como si
cada línea del archivo fuera escrita por el usuario a mano, sólo que
todo sucede de forma automática y obtenemos los resultados al instante:

    suma(0, 0) = 0 (OK)
    suma(2, 3) = 5 (OK)
    suma(4, 8) = 12 (OK)
    suma(2, -3) = -1 (OK)

Creamos un pequeño script `tests.bat` que sólo haga:

    repl.exe < pruebas.txt

¿La ventaja? Podemos --nosotros y otra gente-- agregar más pruebas sin
recompilar el programa original, y con doble-click ver los resultados.
