# Apuntes: Modal de Error y Modal de Confirmación reutilizables en Angular + TailwindCSS

## Índice
1. ¿Para qué sirve un modal de error?
2. Estructura del componente modal-error
3. Código del modal-error.component.ts
4. Código del modal-error.component.html
5. Integración del modal de error en una página
6. Manejo de errores con signals y effect
7. ¿Para qué sirve un modal de confirmación?
8. Estructura del componente modal-confirm
9. Código del modal-confirm.component.ts
10. Código del modal-confirm.component.html
11. Integración del modal de confirmación y llamada a un servicio
12. Buenas prácticas

---

## 1. ¿Para qué sirve un modal de error?
Un modal de error permite mostrar mensajes de error de forma visual y destacada al usuario, bloqueando la interacción hasta que cierre el mensaje. Es útil para errores críticos o de red.

---

## 2. Estructura del componente modal-error
- Recibe el mensaje de error por @Input.
- Emite un evento @Output al cerrarse.
- Usa TailwindCSS para el diseño.

---

## 3. Código del modal-error.component.ts
```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-error',
  templateUrl: './modal-error.component.html',
  standalone: true
})
export class ModalErrorComponent {
  @Input() errorMessage: string = 'Ha ocurrido un error inesperado.';
  @Output() closed = new EventEmitter<void>();

  close() {
    this.closed.emit();
  }
}
```

---

## 4. Código del modal-error.component.html
```html
<div class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
  <div class="bg-white rounded-lg shadow-lg max-w-md w-full p-6 border border-red-200 animate-fadeIn">
    <div class="flex items-center mb-4">
      <svg class="w-8 h-8 text-red-500 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0Z" />
      </svg>
      <h2 class="text-xl font-bold text-red-600">Error</h2>
    </div>
    <div class="text-gray-800 mb-4">
      {{ errorMessage }}
    </div>
    <div class="flex justify-end">
      <button (click)="close()" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">Cerrar</button>
    </div>
  </div>
</div>
```

---

## 5. Integración del modal de error en una página

### TypeScript:
```typescript
import { signal, effect } from '@angular/core';
// ...
public mostrarModal = signal(false);
public mensajeError = signal('');

effect(() => {
  if (this.getIssues().isError()) {
    const err = this.getIssues().error();
    this.mensajeError.set(err?.message ?? err ?? 'Error desconocido');
    this.mostrarModal.set(true);
  }
});

public cerrarModal() {
  this.mostrarModal.set(false);
}
```

### HTML:
```html
@if(mostrarModal()) {
  <app-modal-error [errorMessage]="mensajeError()" (closed)="cerrarModal()"></app-modal-error>
}
@if(!mostrarModal() && mensajeError()) {
  <div class="mt-4 p-3 bg-red-100 text-red-700 rounded shadow">
    {{ mensajeError() }}
  </div>
}
```

---

## 6. Manejo de errores con signals y effect
- Usa signals para controlar la visibilidad y el mensaje.
- Usa `effect` para reaccionar a cambios en el estado de error y mostrar el modal automáticamente.
- Siempre lanza errores como `throw new Error('mensaje')` para asegurar que `.message` esté disponible.

---

## 7. ¿Para qué sirve un modal de confirmación?
Un modal de confirmación permite preguntar al usuario si realmente desea realizar una acción importante (eliminar, guardar, etc.) y solo ejecuta la operación si el usuario confirma.

---

## 8. Estructura del componente modal-confirm
- Recibe el mensaje de confirmación por @Input.
- Emite un evento @Output con true (OK) o false (Cancel).
- Usa TailwindCSS para el diseño.

---

## 9. Código del modal-confirm.component.ts
```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  standalone: true
})
export class ModalConfirmComponent {
  @Input() confirmMessage: string = '¿Estás seguro?';
  @Output() confirmed = new EventEmitter<boolean>();

  ok() {
    this.confirmed.emit(true);
  }

  cancel() {
    this.confirmed.emit(false);
  }
}
```

---

## 10. Código del modal-confirm.component.html
```html
<div class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
  <div class="bg-white rounded-lg shadow-lg max-w-md w-full p-6 border border-blue-200 animate-fadeIn">
    <div class="flex items-center mb-4">
      <svg class="w-8 h-8 text-blue-500 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0Z" />
      </svg>
      <h2 class="text-xl font-bold text-blue-600">Confirmar</h2>
    </div>
    <div class="text-gray-800 mb-4">
      {{ confirmMessage }}
    </div>
    <div class="flex justify-end gap-2">
      <button (click)="cancel()" class="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition">Cancelar</button>
      <button (click)="ok()" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">OK</button>
    </div>
  </div>
</div>
```

---

## 11. Integración del modal de confirmación y llamada a un servicio

### TypeScript:
```typescript
public mostrarConfirm = signal(false);
public confirmMessage = signal('');

public onDelete() {
  this.confirmMessage.set('¿Deseas eliminar este elemento?');
  this.mostrarConfirm.set(true);
}

public onConfirm(result: boolean) {
  this.mostrarConfirm.set(false);
  if (result) {
    // Llama aquí a tu servicio:
    this.miServicio.eliminarElemento();
  }
  // Si es false, no hace nada
}
```

### HTML:
```html
<button (click)="onDelete()">Eliminar</button>
@if(mostrarConfirm()) {
  <app-modal-confirm [confirmMessage]="confirmMessage()" (confirmed)="onConfirm($event)"></app-modal-confirm>
}
```

---

## 12. Buenas prácticas
- El modal de confirmación debe ser reutilizable y recibir el mensaje por @Input.
- Usa signals para controlar la visibilidad y el mensaje.
- Usa eventos @Output para comunicar la acción al componente padre.
- Solo ejecuta la operación del servicio si el usuario confirma (OK).
- Usa TailwindCSS para un diseño moderno y responsivo.

---

# Anexo: Test unitarios y servicios globales de notificación

## 13. Test unitarios para modales

### Test básico para ModalErrorComponent (Jest)
```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalErrorComponent } from './modal-error.component';

describe('ModalErrorComponent', () => {
  let component: ModalErrorComponent;
  let fixture: ComponentFixture<ModalErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalErrorComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(ModalErrorComponent);
    component = fixture.componentInstance;
    component.errorMessage = 'Error de prueba';
    fixture.detectChanges();
  });

  it('debe mostrar el mensaje de error', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Error de prueba');
  });

  it('debe emitir el evento closed al hacer click en cerrar', () => {
    jest.spyOn(component.closed, 'emit');
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    expect(component.closed.emit).toHaveBeenCalled();
  });
});
```

---

## 14. Servicio global de notificación (ejemplo básico)

### notification.service.ts
```typescript
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  public message = signal<string | null>(null);
  public type = signal<'success' | 'error' | 'info' | null>(null);

  show(msg: string, type: 'success' | 'error' | 'info' = 'info') {
    this.message.set(msg);
    this.type.set(type);
    setTimeout(() => this.clear(), 4000);
  }

  clear() {
    this.message.set(null);
    this.type.set(null);
  }
}
```

### Uso en un componente
```typescript
constructor(private notification: NotificationService) {}

onSave() {
  this.notification.show('Guardado correctamente', 'success');
}
```

### Mostrar notificación en el template
```html
@if(notification.message()) {
  <div class="fixed top-4 right-4 px-4 py-2 rounded shadow-lg"
       [ngClass]="{
         'bg-green-500 text-white': notification.type() === 'success',
         'bg-red-500 text-white': notification.type() === 'error',
         'bg-blue-500 text-white': notification.type() === 'info'
       }">
    {{ notification.message() }}
  </div>
}
```

---

Estos anexos te permiten testear los modales y centralizar la gestión de notificaciones en tu app Angular.
