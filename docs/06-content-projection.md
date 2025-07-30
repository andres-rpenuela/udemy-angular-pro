# Índice

1. [¿Qué es Content Projection?](#qué-es-content-projection)
2. [Ejemplo básico](#ejemplo-básico)
3. [Proyección múltiple con select](#proyección-múltiple-con-select)
4. [Content projection selectiva usando atributos](#content-projection-selectiva-usando-atributos)
5. [Ejemplo completo paso a paso](#ejemplo-completo-paso-a-paso)
6. [Claves para select](#claves-para-select)

---

## ¿Qué es Content Projection?

La **proyección de contenido** en Angular permite que un componente *envuelva* contenido definido fuera de él y lo proyecte dentro de su template. Esto se hace usando la etiqueta especial `<ng-content>`.

---

## Ejemplo básico

Componente envolvente:

```ts
@Component({
  selector: 'app-card',
  template: `
    <div class="card">
      <ng-content></ng-content>
    </div>
  `
})
export class CardComponent {}
```

Uso:

```html
<app-card>
  <p>Este contenido se proyectará dentro del componente card</p>
</app-card>
```

Resultado en el DOM:

```html
<app-card>
  <div class="card">
    <p>Este contenido se proyectará dentro del componente card</p>
  </div>
</app-card>
```
> Nota: Se puede uilitar **host** en la directiva del compoente para añadir la clase `card` en `<app-card>` y no crear el div con la clase
>
> ```ts
> @Component({
>   selector: 'app-card',
>   template: `
>       <ng-content></ng-content>
>   `,
>   host: { class: 'card' }
> })
> //...
> ```
>
> En la vista donde se carga el componente: 
> ```html
> <app-card>
>  <p>Este contenido se proyectará dentro del componente card</p>
> </app-card>
> ```
>
>  El restualdo del com:
> ```html
> <app-card class="card>
>   <p>Este contenido se proyectará dentro del componente card</p>
> </app-card>
> ```

---

## Proyección múltiple con select

Puedes proyectar diferentes partes del contenido en diferentes lugares del template usando el atributo `select`:

```ts
@Component({
  selector: 'app-layout',
  template: `
    <header><ng-content select="[slot=header]"></ng-content></header>
    <main><ng-content></ng-content></main>
    <footer><ng-content select="[slot=footer]"></ng-content></footer>
  `
})
export class LayoutComponent {}
```

Uso:

```html
<app-layout>
  <div slot="header">Encabezado</div>
  <p>Contenido principal</p>
  <div slot="footer">Pie de página</div>
</app-layout>
```

---

## Content projection selectiva usando atributos

El atributo `select` te permite **filtrar qué contenido externo se inserta** en cada punto de proyección dentro del componente. Angular evalúa los elementos hijos del host y los inserta donde corresponde según el selector.

---

## Ejemplo completo paso a paso

### 1. Componente que proyecta contenido

```ts
@Component({
  selector: 'app-card',
  template: `
    <div class="card">
      <header class="card-header">
        <ng-content select="[title]"></ng-content>
      </header>
      <section class="card-body">
        <ng-content select="[body]"></ng-content>
      </section>
    </div>
  `
})
export class CardComponent {}
```

### 2. Uso del componente

```html
<app-card>
  <h1 title>Este es el título</h1>
  <p body>Este es el cuerpo del contenido</p>
</app-card>
```

### 3. ¿Qué pasa en el DOM?

Angular lo proyecta así:

```html
<app-card>
  <div class="card">
    <header class="card-header">
      <h1 title>Este es el título</h1>
    </header>
    <section class="card-body">
      <p body>Este es el cuerpo del contenido</p>
    </section>
  </div>
</app-card>
```

---

## Claves para select

| Selector               | Significado                                                    |
| ---------------------- | -------------------------------------------------------------- |
| `[title]`              | Proyecta elementos con el atributo `title` (ej. `<div title>`) |
| `.clase`               | Proyecta elementos con clase `clase`                           |
| `p`, `h1`, `div`, etc. | Proyecta elementos por tipo de tag                             |
| `:not([attr])`         | Filtros más avanzados                                          |