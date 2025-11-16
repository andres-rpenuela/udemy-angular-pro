import { InjectionToken } from "@angular/core";

/*
  * Token to provide the server language in an Angular Universal application.
  * This token can be used to inject the language setting determined on the server side.
  * Type: string
  * Usage: Inject this token in services or components that need to access the server language.
*/
export const SERVER_LANGUAGE_TOKEN = new InjectionToken<string>('SERVER_LANGUAGE_TOKEN');

