import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'pokemon/:id',
    renderMode: RenderMode.Server // ❌ o Prerender si defines getPrerenderParams
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
