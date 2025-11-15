import { ApplicationConfig, inject, PLATFORM_ID, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, REQUEST, RESPONSE_INIT } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {SsrCookieService} from 'ngx-cookie-service-ssr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), provideClientHydration(withEventReplay()),

    // Configruacion global de servicios
    // 🍪 Cookies SSR
    SsrCookieService,


    /** Configuracion para ng-transalte */
    // // 🌐 HTTP Client (necesario para ngx-translate)
    // provideHttpClient(),

    // // 🌍 NGX-Translate
    // importProvidersFrom(
    //   TranslateModule.forRoot({
    //     loader: {
    //       provide: TranslateLoader,
    //       useFactory: HttpLoaderFactory,
    //       deps: [HttpClient]
    //     },
    //     defaultLanguage: 'en'
    //   })
    // ),

    // // 🎯 APIs del navegador como providers
    // // Api del navegador (window)
    // {  provide: 'WINDOW',
    //   useFactory: (platformId: Object) =>
    //     isPlatformBrowser(platformId) ? window : null,
    //   deps: [PLATFORM_ID]
    // }
  ]
};
