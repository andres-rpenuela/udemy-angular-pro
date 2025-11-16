// app.config.server.ts
import { mergeApplicationConfig, ApplicationConfig, inject, REQUEST, RESPONSE_INIT, PLATFORM_ID, Injector } from '@angular/core';
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
    {
      provide: SERVER_LANGUAGE_TOKEN,
      useValue: 'en-US' // Example: set default server language to 'en-US'
    }
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
