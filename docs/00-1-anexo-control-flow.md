# 📘 Apuntes Angular 20 – Nuevas Directivas de Control de Flujo (`@if`, `@for`, `@switch`, `@let`)

---

## 📑 Índice

1. Introducción
2. `@if … @else`
   2.1. Sintaxis básica
   2.2. Uso con `@else if` y `@else`
3. `@for`
   3.1. Sintaxis básica
   3.2. Opciones: `track`, `let i`, `first`, `last`, `even`, `odd`
4. `@switch … @case … @default`
   4.1. Sintaxis
   4.2. Ejemplo con Pokémon
5. `@let`
   5.1. Definición y uso
   5.2. Ejemplo práctico
6. Ventajas frente a `*ngIf`, `*ngFor`, `*ngSwitch`
7. Ejemplo completo (con Pokémon)

---

## 1. Introducción

Desde Angular 17 se introdujo la **nueva sintaxis de control de flujo**, disponible también en Angular 20.
Sustituye las directivas estructurales (`*ngIf`, `*ngFor`, `*ngSwitch`) por bloques más **claros, expresivos y cercanos a TypeScript**.

---

## 2. `@if … @else`

### 2.1 Sintaxis básica

```html
@if (condicion) {
  <p>Se cumple la condición</p>
}
```

### 2.2 Uso con `@else if` y `@else`

```html
@if (pokemon.loading()) {
  <p>Cargando…</p>
} @else if (pokemon.error()) {
  <p class="text-red-600">Error al cargar.</p>
} @else {
  <p>Pokémon cargado ✅</p>
}
```

---

## 3. `@for`

### 3.1 Sintaxis básica

```html
@for (item of items; track item.id) {
  <p>{{ item.name }}</p>
}
```

### 3.2 Opciones

* `track` → equivalente a `trackBy` (mejora el rendimiento).
* `let i = $index` → índice de la iteración.
* `let first = $first` → primer elemento.
* `let last = $last` → último elemento.
* `let even = $even` / `let odd = $odd` → par o impar.

📌 Ejemplo:

```html
@for (t of pokemon.value()?.types; track t.type.name; let i = $index; let first = $first; let last = $last) {
  <span>{{ i + 1 }}. {{ t.type.name }}
    @if (first) { ⭐ } 
    @if (last) { 🔥 }
  </span>
}
```

---

## 4. `@switch`

### 4.1 Sintaxis

```html
@switch (valor) {
  @case ('opcion1') { ... }
  @case ('opcion2') { ... }
  @default { ... }
}
```

### 4.2 Ejemplo con Pokémon

```html
@switch (pokemon.value()?.types[0]?.type.name) {
  @case ('grass') {
    <span class="bg-green-200">Planta</span>
  }
  @case ('fire') {
    <span class="bg-red-200">Fuego</span>
  }
  @default {
    <span class="bg-gray-200">Otro</span>
  }
}
```

---

## 5. `@let`

### 5.1 Definición

Permite **guardar una expresión en una variable** para reutilizarla en el template.

### 5.2 Ejemplo

```html
@let p = pokemon.value();
@if (p) {
  <h2>{{ p.name }}</h2>
  <p>ID: {{ p.id }}</p>
}
```

---

## 6. Ventajas frente a `*ngIf`, `*ngFor`, `*ngSwitch`

* Sintaxis **más cercana a TypeScript**.
* Más clara y legible.
* Evita abusar de `ng-container`.
* Menor indentación en templates grandes.
* Mejora la experiencia de desarrollo.

---

## 7. Ejemplo completo con Pokémon

```html
<div class="max-w-xl mx-auto p-6">
  @if (pokemon.loading()) {
    <p class="text-gray-500">Cargando Pokémon...</p>
  } @else if (pokemon.error()) {
    <p class="text-red-600">Error: no se pudo cargar el Pokémon.</p>
  } @else {
    @let p = pokemon.value();

    <div class="bg-white rounded-xl shadow p-4">
      <h2 class="text-xl font-bold capitalize">{{ p.name }}</h2>
      <p class="text-gray-500">#{{ p.id }}</p>

      <h3 class="mt-4 font-semibold">Tipos</h3>
      @for (t of p.types; track t.type.name; let i = $index) {
        <span class="capitalize">{{ i + 1 }}. {{ t.type.name }}</span>
      }

      <h3 class="mt-4 font-semibold">Estadísticas</h3>
      @for (s of p.stats; track s.stat.name) {
        <p>{{ s.stat.name }}: {{ s.base_stat }}</p>
      }
    </div>
  }
</div>
```