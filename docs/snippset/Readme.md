🚀 Cómo usar

1. Crea la carpeta .vscode en tu proyecto si no existe.
2. Dentro, crea un archivo angular-test.code-snippets.
3. Copia y pega el JSON del fichero adjutno
4. En un archivo .spec.ts, escribe el prefijo (ng-service-test, ng-service-spy-test, ng-service-http-test) y presiona Tab → ¡te genera la plantilla!

---
Ah, ya entendí 👌
El prefijo `ng-service-test` que te pasé no viene **por defecto en VS Code**. Es un **snippet personalizado**, tú tienes que crearlo manualmente para que VS Code lo reconozca.

---

## 🔧 Pasos para que VS Code lo reconozca

1. En VS Code abre el **Command Palette** (`Ctrl+Shift+P` o `Cmd+Shift+P` en Mac).
2. Busca **"Preferences: Configure User Snippets"**.
3. Elige **New Global Snippets file…** (o el workspace actual si solo quieres en un proyecto).
4. Ponle nombre, por ejemplo: `angular-test.code-snippets`.
5. Pega dentro el JSON que te compartí (o solo la parte que quieras, ejemplo el básico).

Ejemplo mínimo para probar:

```json
{
  "Angular Service Test (básico)": {
    "prefix": "ng-service-test",
    "body": [
      "import { TestBed } from '@angular/core/testing';",
      "import { ${1:MyService} } from './${1/(.*)/${1:/downcase}/}.service';",
      "",
      "describe('${1:MyService}', () => {",
      "  let service: ${1:MyService};",
      "",
      "  beforeEach(() => {",
      "    TestBed.configureTestingModule({});",
      "    service = TestBed.inject(${1:MyService});",
      "  });",
      "",
      "  it('debería crearse', () => {",
      "    expect(service).toBeTruthy();",
      "  });",
      "});"
    ]
  }
}
```

---

## 🚀 Cómo usarlo

* Abre un archivo de test, por ejemplo `user.service.spec.ts`.
* Escribe `ng-service-test`.
* Presiona **Tab** → te genera la plantilla.

---

👉 Pregunta: ¿quieres que te arme un **archivo completo `angular-test.code-snippets`** listo para pegar en tu `.vscode` (con los tres casos: básico, con spy y con HTTP)?
