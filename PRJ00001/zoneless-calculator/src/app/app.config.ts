import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // activar zoneless:
    // - eventCoalescing: agrupa múltiples eventos DOM.
    // - runCoalescing: agrupa múltiples tareas asincrónicas (setTimeout, Promise, etc.).
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
    provideRouter(routes)
  ]
};
