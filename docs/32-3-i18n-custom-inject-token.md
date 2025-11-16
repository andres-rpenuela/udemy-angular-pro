# Custom Inject Token.

Link oficial: https://angular.dev/api/core/InjectionToken

Es un objeto especial creado con la clase **InjectionToken** que sirve como clave para obtener una dependencia del inyector.

## 📌 Ejemplo simple

Definimos un token:
```ts
export const API_URL = new InjectionToken<string>('API_URL');
```

Lo proveemos:
```ts
providers: [
  { provide: API_URL, useValue: 'https://api.ejemplo.com' }
]
```

Lo inyectamos:

```ts
constructor(@Inject(API_URL) private apiUrl: string) {}
```

## Ejemplo de Token de configuración.
```ts
export interface AppConfig {
  title: string;
  version: number;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');

@NgModule({
  providers: [
    { 
      provide: APP_CONFIG, 
      useValue: { title: 'Mi App', version: 1.0 }
    }
  ]
})
export class AppModule {}
```

Y se inyecta en:
```ts
constructor(@Inject(APP_CONFIG) private config: AppConfig) {}
```

## Multiproveedores

Puedes usar un injection token para asociar una lista de valores:
```ts
export const LOGGER_HANDLERS = new InjectionToken<LoggerHandler[]>('logger.handlers');

providers: [
  { provide: LOGGER_HANDLERS, useClass: ConsoleLogger, multi: true },
  { provide: LOGGER_HANDLERS, useClass: FileLogger, multi: true }
];
```

## 📌 ¿Cuándo se usan?

- ✔ Para inyectar valores simples
- ✔ Para configuración global de módulos o servicios
- ✔ Para multi-providers (varios valores asociados al mismo token)
- ✔ Para evitar colisiones de nombres
- ✔ Para DI en funciones standalone con inject()

## Ejemplo de uso con `ngx-transalate-server-ssr`


1. Creamos el token, para leer la cookien y enivara la servidro de node.

```ts
import { InjectionToken } from "@angular/core";

/*
  * Token to provide the server language in an Angular Universal application.
  * This token can be used to inject the language setting determined on the server side.
  * Type: string
  * Usage: Inject this token in services or components that need to access the server language.
*/
export const SERVER_LANGUAGE_TOKEN = new InjectionToken<string>('SERVER_LANGUAGE_TOKEN');
```

2. Proveemos en el servidor de Node

```js
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
``` 

3. Proveemos en servicio de language para leer valor proveido por SERVER_LANAGUAGE_TOKEN, en el servidor

```ts
// Da error de injección en el constructor, cuando se ejecuta en el cliente porque no es proveedio
  // constructor(@Inject(SERVER_LANGUAGE_TOKEN) private serverLanguage: string) {
  //       console.debug('Lenguaje del servidor:', serverLanguage);
  // }

  constructor() {
      if(this.plantformId === 'server'){
        const serverLanguage = inject(SERVER_LANGUAGE_TOKEN) as string;
        console.debug('Lenguaje del servidor:', serverLanguage);
      }
    }
`` 