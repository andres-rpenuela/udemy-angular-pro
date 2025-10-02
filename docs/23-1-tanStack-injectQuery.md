
# Apuntes: Uso de injectQuery con signals en TanStack Query Angular

## 1. Estructura básica de injectQuery

```typescript
import { injectQuery } from '@tanstack/angular-query-experimental';

// Ejemplo simple con valor fijo
const issueQuery = injectQuery(() => ({
  queryKey: ['issue', 1],
  queryFn: () => getIssueByNumber(1)
}));
```

## 2. Uso de enabled para controlar la ejecución

```typescript
const issueQuery = (id: number | null) => injectQuery(() => ({
  queryKey: ['issue', id],
  queryFn: () => getIssueByNumber(id!),
  enabled: id != null
}));
```

- Si `id` es null, la query no se ejecuta.
- Puedes mostrar un mensaje personalizado si `id` es null.

## 3. Uso con signals (recomendado para reactividad)

```typescript
import { Signal } from '@angular/core';

// issueNumber es un Signal<number | null>
const issueQuery = (issueNumber: Signal<number | null>) => injectQuery(() => ({
  queryKey: ['issue', issueNumber()], // Tipado estricco
  queryFn: () => getIssueByNumber(issueNumber()!),
  enabled: issueNumber() != null
}));
```

- La query se reactiva automáticamente cuando cambia el valor del signal.
- Solo se ejecuta si el id es válido.

## 4. Manejo de error si el id no existe

```typescript
const issueQuery = (id: number | null) => injectQuery(() => ({
  queryKey: ['issue', id],
  queryFn: () => {
    if (id == null) throw new Error('ID no encontrado');
    return getIssueByNumber(id);
  },
  enabled: id != null
}));
```

- Si el id es null, lanza un error y puedes mostrar el mensaje en el componente.

---

Estos patrones te permiten controlar la ejecución y el manejo de errores de queries en Angular usando TanStack Query y signals.