import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideServerRendering } from '@angular/ssr';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // uso de Zoneless, e incompatible con provideZoneChangeDetection
    provideZonelessChangeDetection(),
    // para usar Zone.js, de frma avanzada
    //provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
    provideRouter(routes),
    // provideRouter(routes, withHashLocation()),
    provideClientHydration(withEventReplay()),
    // htt
    provideHttpClient(withFetch())
  ]
};
