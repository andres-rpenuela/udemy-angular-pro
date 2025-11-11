# Apuntes sobre Testing con Jasmine/Angular: Espiar el "emit" del output al ahcer click en un botton.

## 📋 Spy (Espionaje) en Tests

### ¿Qué es un Spy?
Un **spy** es una función que te permite monitorear si una función ha sido llamada, cuántas veces y con qué parámetros.

### Sintaxis básica:
```typescript
spyOn(objeto, 'metodo');
```

### Casos de uso comunes:

#### 1. **Espiar Outputs (EventEmitter)**
```typescript
// Espiar si un EventEmitter fue llamado
spyOn(component.onThemeChange, 'emit');

// Verificar que fue llamado
expect(component.onThemeChange.emit).toHaveBeenCalled();

// Verificar que fue llamado con parámetros específicos
expect(component.onThemeChange.emit).toHaveBeenCalledWith(true);

// Verificar cuántas veces fue llamado
expect(component.onThemeChange.emit).toHaveBeenCalledTimes(1);
```

#### 2. **Espiar métodos del componente**
```typescript
spyOn(component, 'toggleTheme');
button.click();
expect(component.toggleTheme).toHaveBeenCalled();
```

#### 3. **Espiar servicios**
```typescript
spyOn(service, 'getData').and.returnValue(of(mockData));
```

---

## 🎯 Selección de Elementos HTML

### Métodos para obtener elementos:

#### 1. **querySelector** (nativeElement)
```typescript
// Por atributo personalizado
const button = fixture.nativeElement.querySelector('[btn-data-theme-toggle]');

// Por clase CSS
const button = fixture.nativeElement.querySelector('.theme-button');

// Por tag
const button = fixture.nativeElement.querySelector('button');

// Por ID
const button = fixture.nativeElement.querySelector('#theme-toggle');
```

#### 2. **DebugElement** (más robusta)
```typescript
import { By } from '@angular/platform-browser';

// Por CSS selector
const buttonDebug = fixture.debugElement.query(By.css('[btn-data-theme-toggle]'));
const button = buttonDebug?.nativeElement;

// Por directiva
const buttonDebug = fixture.debugElement.query(By.directive(SomeDirective));
```

---

## ✅ Verificaciones Comunes

### 1. **Existencia del elemento**
```typescript
// El elemento existe
expect(button).toBeTruthy();

// El elemento NO existe
expect(button).toBeNull();
expect(button).toBeFalsy();
```

### 2. **Estado del elemento**
```typescript
// Verificar texto
expect(button.textContent).toBe('Toggle Theme');

// Verificar clases CSS
expect(button.classList.contains('active')).toBe(true);

// Verificar atributos
expect(button.getAttribute('disabled')).toBeNull();

// Verificar si está visible
expect(button.style.display).not.toBe('none');
```

### 3. **Interacciones**
```typescript
// Simular click
button.click();

// Simular eventos
button.dispatchEvent(new Event('click'));

// Verificar que el spy fue llamado después del click
expect(component.onThemeChange.emit).toHaveBeenCalled();
```

---

## 🔄 Flujo típico de un test

```typescript
it('should emit onThemeChange when theme toggle button is clicked', () => {
  // 1. ARRANGE - Configurar el spy
  spyOn(component.onThemeChange, 'emit');

  // 2. ARRANGE - Configurar inputs
  fixture.componentRef.setInput('showThemeToggle', true);
  fixture.detectChanges(); // Renderizar cambios

  // 3. ACT - Obtener elemento y interactuar
  const button = fixture.nativeElement.querySelector('[btn-data-theme-toggle]');
  
  // 4. ASSERT - Verificar que existe
  expect(button).toBeTruthy();
  
  // 5. ACT - Simular interacción
  button.click();

  // 6. ASSERT - Verificar resultado esperado
  expect(component.onThemeChange.emit).toHaveBeenCalled();
});
```

---

## 🛠️ Mejores Prácticas

### 1. **Usar data attributes para testing**
```html
<!-- ✅ Buena práctica -->
<button btn-data-theme-toggle>Toggle</button>

<!-- ❌ Evitar (puede cambiar) -->
<button class="btn btn-primary">Toggle</button>
```

### 2. **Verificar existencia antes de interactuar**
```typescript
const button = fixture.nativeElement.querySelector('[btn-data-theme-toggle]');
expect(button).toBeTruthy(); // Verificar que existe
button.click(); // Luego interactuar
```

### 3. **Llamar detectChanges() después de setInput**
```typescript
fixture.componentRef.setInput('showThemeToggle', true);
fixture.detectChanges(); // ¡Importante!
```

### 4. **Tests para casos positivos y negativos**
```typescript
// Caso positivo: el botón debe aparecer
it('should render button when showThemeToggle is true', () => {
  fixture.componentRef.setInput('showThemeToggle', true);
  fixture.detectChanges();
  const button = fixture.nativeElement.querySelector('[btn-data-theme-toggle]');
  expect(button).toBeTruthy();
});

// Caso negativo: el botón NO debe aparecer
it('should not render button when showThemeToggle is false', () => {
  fixture.componentRef.setInput('showThemeToggle', false);
  fixture.detectChanges();
  const button = fixture.nativeElement.querySelector('[btn-data-theme-toggle]');
  expect(button).toBeNull();
});
```