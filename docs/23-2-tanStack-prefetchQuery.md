
# Apuntes: Prefetch de Query en Angular con TanStack Query usando un índice (id)

El prefetch permite cargar datos en caché antes de que el usuario navegue a una ruta o componente, mejorando la experiencia de usuario.

### Ejemplo básico

Supón que tienes una función para obtener un Pokémon por su id:

```typescript
// pokemon.service.ts
getPokemonById(id: number) {
	return this.http.get<Pokemon>(`/api/pokemon/${id}`);
}
```

### Prefetch usando TanStack Query

En tu componente o servicio, puedes hacer el prefetch así:

```typescript
import { injectQueryClient } from '@tanstack/angular-query-experimental';

const queryClient = injectQueryClient();

function prefetchPokemon(id: number) {
  // convirte un valor a una señal
  const idSignal = signal(id);

	queryClient.prefetchQuery({
		queryKey: ['pokemon', idSignal()], // Tipado query, usar el mismo tipo que en injectQuery
		queryFn: () => this.getPokemonById( idSignal() ),
    staleTime: 500 // Tiempo ms considerado como fresco, para no repetir la llamada (opt)
	});
}
```

### Uso típico

Puedes llamar a `prefetchPokemon(id)` antes de navegar a la página de detalles, por ejemplo, en un evento hover o click:

```typescript
<button (mouseenter)="prefetchPokemon(pokemon.id)">
	Ver detalles
</button>
```

Esto almacenará en caché la respuesta para ese id, y cuando navegues a la ruta de detalles, la query se resolverá instantáneamente desde caché.

---