import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // cuando es un query param y no se quiere generar contenido statico
  // {
  //   path: 'pokemon/:id',
  //   renderMode: RenderMode.Server // ❌ o Prerender si defines getPrerenderParams
  // },
  // exmaple in angular 20, de prerender )static contet)
// {
//     path: 'post/:id/**',
//     renderMode: RenderMode.Prerender,
//     async getPrerenderParams() {
//       return [
//         { id: '1', '**': 'foo/3' },
//         { id: '2', '**': 'bar/4' },
//       ]; // Generates paths like: /post/1/foo/3, /post/2/bar/4
//     },
// },
  {
    path: 'pokemons/page/:page',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return [
        { page: '1' },
        { page: '2' },
        { page: '3' },
      ]; // Generates paths like: pokemon/page/1, pokemon/page/2, pokemon/page/3
    },
  },
  { // se ha cmadio a pathvairable
    path: 'pokemon/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      // Simulación de fetch/archivo/local DB
      const ids = ['1', '2', '3', '4', '5'];
      return ids.map(id => ({ id }));
    },
  },
  {
  path: '**',
  renderMode: RenderMode.Server // fallback dinámico: el servidor renderiza las rutas no definidas (en un server interno ejucta el html y lo envia al cliente)
  // renderMode: RenderMode.Prerender // fallback estático: genera un HTML fijo (ej. página 404) en el build
  //renderMode: RenderMode.Client // se renderiza solo en el navegador, el server devuelve un index.html vacio, y angular cli ejecuta el javascript y pinta el conteido

}
];
