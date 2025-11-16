// app.config.server.ts
import { mergeApplicationConfig, ApplicationConfig, inject, REQUEST, RESPONSE_INIT, PLATFORM_ID, Injector, Optional } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { SERVER_LANGUAGE_TOKEN } from './tokens/language/server-language.token';


const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    {
      provide: 'REQUEST',
      useFactory: (injector: Injector) => {
        return injector.get(REQUEST, null);
      },
      deps: [Injector]
    },
    {
      provide: 'RESPONSE',
      useFactory: (injector: Injector) => {
        return injector.get(RESPONSE_INIT, null);
      },
      deps: [Injector]
    },
    // {
    //   provide: SERVER_LANGUAGE_TOKEN,
    //   useValue: 'en-US' // Example: set default server language to 'en-US'
    // }
    {
      provide: SERVER_LANGUAGE_TOKEN,
      useFactory: (req: any, injector: Injector) => {
        console.debug('🔧 [CONFIG] SERVER_LANGUAGE_TOKEN factory called');
        console.debug('🔧 [CONFIG] REQUEST object:', req);

        // ✅ ESTRATEGIA 1: Usar el idioma detectado en Express
        if (req && (req as any).detectedLanguage) {
          const detectedLang = (req as any).detectedLanguage;
          console.debug('🌍 [CONFIG] Using detected language from Express:', detectedLang);
          return detectedLang;
        }

        // ✅ ESTRATEGIA 2: Intentar obtener desde DETECTED_LANGUAGE token
        try {
          const detectedFromToken = injector.get('DETECTED_LANGUAGE', null);
          if (detectedFromToken) {
            console.debug('🌍 [CONFIG] Using language from DETECTED_LANGUAGE token:', detectedFromToken);
            return detectedFromToken;
          }
        } catch (e) {
          console.debug('🔧 [CONFIG] No DETECTED_LANGUAGE token found');
        }

        // ✅ ESTRATEGIA 3: Parsear cookies directamente (fallback)
        if (req && req.headers && req.headers.cookie) {
          const cookies = req.headers.cookie;
          console.debug('🍪 [CONFIG] Parsing cookies directly:', cookies);
          const langMatch = cookies.match(/lang=([^;,\s]+)/);
          if (langMatch) {
            const langFromCookie = langMatch[1];
            console.debug('🌍 [CONFIG] Language from direct cookie parsing:', langFromCookie);
            return langFromCookie;
          }
        }

        // ✅ ESTRATEGIA 4: Default fallback
        console.debug('🔧 [CONFIG] Using default language: it');
        return 'it';
      },
      deps: [[new Optional(), REQUEST], Injector]
    }
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
