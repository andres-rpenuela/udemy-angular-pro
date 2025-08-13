import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // uso de Zoneless, e incompatible con provideZoneChangeDetection
    provideZonelessChangeDetection(),
    // para usar Zone.js, de frma avanzada
    //provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
    provideRouter(routes), provideClientHydration(withEventReplay())
  ]
};
