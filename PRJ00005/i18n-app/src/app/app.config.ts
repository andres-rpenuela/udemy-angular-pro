import { ApplicationConfig, importProvidersFrom, inject, PLATFORM_ID, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, REQUEST, RESPONSE_INIT } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {SsrCookieService} from 'ngx-cookie-service-ssr';
import {  provideHttpClient, withFetch } from '@angular/common/http';

import {   provideTranslateService, TranslateModule } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), provideClientHydration(withEventReplay()),

    // Configruacion global de servicios
    // 🍪 Cookies SSR
    SsrCookieService,


    /** Configuracion para ng-transalte */
    // 🌐 HTTP Client (necesario para ngx-translate)
    provideHttpClient( withFetch()),

    // 🌍 NGX-Translate
    // Opción A.
    provideTranslateService({
      lang: 'en',
      fallbackLang: 'en',
      loader: provideTranslateHttpLoader({
        prefix: './assets/i18n/',
        suffix: '.json'
      })
    }),

    // // 🎯 APIs del navegador como providers
    // // Api del navegador (window)
    // {  provide: 'WINDOW',
    //   useFactory: (platformId: Object) =>
    //     isPlatformBrowser(platformId) ? window : null,
    //   deps: [PLATFORM_ID]
    // }
  ]
};
