# Crear Snippets en Visaul Studio COde (_formato JSON_)

1. Abre tu VS Code.
2. Presiona Ctrl+Shift+P > Preferences: Configure User Snippets.
3. Elige o crea un archivo de snippet global o para tu proyecto.
4. Pega el JSON dentro.
5. Luego escribe ng-component-test en un archivo de prueba y presiona tab ↹ para expandir.

## Snippets de Test de componente
```json
{
  "Angular Component Test Snippet": {
    "prefix": "ng-component-test",
    "body": [
      "import { ComponentFixture, TestBed } from '@angular/core/testing';",
      "import ${1:ComponentName} from './${1/(.*)/${1:/downcase}-layout.component/}';",
      "",
      "describe('${1:ComponentName}', () => {",
      "  let fixture: ComponentFixture<${1:ComponentName}>;",
      "  let component: ${1:ComponentName};",
      "  let compiled: HTMLElement;",
      "",
      "  beforeEach(async () => {",
      "    await TestBed.configureTestingModule({",
      "      imports: [${1:ComponentName}]",
      "    }).compileComponents();",
      "",
      "    fixture = TestBed.createComponent(${1:ComponentName});",
      "    component = fixture.componentInstance;",
      "    compiled = fixture.nativeElement as HTMLElement;",
      "    ",
      "    fixture.detectChanges();",
      "  });",
      "",
      "  it('should create the component', () => {",
      "    expect(component).toBeTruthy();",
      "  });",
      "});"
    ],
    "description": "Snippet para pruebas de componente Angular con TestBed"
  }
}
```

## Snippets de Test de Servicio

```json
{
  "Angular Service Test Snippet": {
    "prefix": "ng-service-test",
    "body": [
      "import { TestBed } from '@angular/core/testing';",
      "import { ${1:ServiceName} } from './${1/(.*)/${1:/downcase}.service/}';",
      "",
      "describe('${1:ServiceName}', () => {",
      "  let service: ${1:ServiceName};",
      "",
      "  beforeEach(() => {",
      "    TestBed.configureTestingModule({});",
      "    service = TestBed.inject(${1:ServiceName});",
      "  });",
      "",
      "  it('should be created', () => {",
      "    expect(service).toBeTruthy();",
      "  });",
      "});"
    ],
    "description": "Snippet para pruebas de servicios Angular"
  }
}
``` 

## Snippets de Test de Pipe

```json
{
  "Angular Pipe Test Snippet": {
    "prefix": "ng-pipe-test",
    "body": [
      "import { ${1:PipeName} } from './${1/(.*)/${1:/downcase}.pipe/}';",
      "",
      "describe('${1:PipeName}', () => {",
      "  let pipe: ${1:PipeName};",
      "",
      "  beforeEach(() => {",
      "    pipe = new ${1:PipeName}();",
      "  });",
      "",
      "  it('should create an instance', () => {",
      "    expect(pipe).toBeTruthy();",
      "  });",
      "",
      "  it('should transform value', () => {",
      "    const result = pipe.transform(${2:value});",
      "    expect(result).toBe(${3:expected});",
      "  });",
      "});"
    ],
    "description": "Snippet para pruebas de pipes Angular"
  }
}
```

## Snippets de Test de Directiva

```json
{
  "Angular Directive Test Snippet": {
    "prefix": "ng-directive-test",
    "body": [
      "import { Component } from '@angular/core';",
      "import { ComponentFixture, TestBed } from '@angular/core/testing';",
      "import { ${1:DirectiveName} } from './${1/(.*)/${1:/downcase}.directive/}';",
      "",
      "@Component({",
      "  template: `<div ${2:app${1}}></div>`",
      "})",
      "class TestComponent {}",
      "",
      "describe('${1:DirectiveName}', () => {",
      "  let fixture: ComponentFixture<TestComponent>;",
      "",
      "  beforeEach(() => {",
      "    TestBed.configureTestingModule({",
      "      declarations: [TestComponent, ${1:DirectiveName}]",
      "    });",
      "    fixture = TestBed.createComponent(TestComponent);",
      "    fixture.detectChanges();",
      "  });",
      "",
      "  it('should create an instance', () => {",
      "    const directiveEl = fixture.nativeElement.querySelector('[${2:app${1}}]');",
      "    expect(directiveEl).toBeTruthy();",
      "  });",
      "});"
    ],
    "description": "Snippet para pruebas de directivas Angular"
  }
}
```