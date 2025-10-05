
# Apuntes: setQueryData con TanStack Query en Angular

`setQueryData` permite actualizar manualmente los datos almacenados en caché para una query específica, sin necesidad de hacer una nueva petición al servidor. Es útil para actualizar la UI de forma instantánea tras una acción (optimistic update) o para sincronizar datos locales.

## Ejemplo básico

Supón que tienes una query para obtener un Pokémon por id:

```typescript
const queryKey = ['pokemon', id];
```

Puedes actualizar los datos en caché así:

```typescript
import { injectQueryClient } from '@tanstack/angular-query-experimental';

const queryClient = injectQueryClient();

function actualizarPokemonEnCache(id: number, nuevoPokemon: Pokemon) {
	queryClient.setQueryData(['pokemon', id], nuevoPokemon);
}
```

## Uso típico

Por ejemplo, después de editar un Pokémon y recibir la respuesta del backend, puedes actualizar la caché para que la UI muestre el nuevo valor sin esperar a un refetch:

```typescript
this.pokemonService.updatePokemon(pokemon).subscribe((actualizado) => {
	queryClient.setQueryData(['pokemon', actualizado.id], actualizado
	  // (opt) en lugar de staleTime, se puede usar updatedAt para forzar que los datos estén "viejos" o nuevos y se actualicen en el background 
     { updatedAt: Date.now() + 1000 * 60 } // Hace que los datos tengan 1 minuto de validez, para que no estén "frescos" y se actualicen en el background
	);
});
```

## Notas
- Si la query no existe en caché, `setQueryData` la crea.
- Es ideal para actualizaciones optimistas o sincronización local.