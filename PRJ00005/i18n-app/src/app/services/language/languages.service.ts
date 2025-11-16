import {  effect, Inject, inject, Injectable, INJECTOR, linkedSignal, PLATFORM_ID, signal } from '@angular/core';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { TranslateService } from '@ngx-translate/core';
import { SERVER_LANGUAGE_TOKEN } from '../../tokens/language/server-language.token';

export type LANGUAGE = 'en' | 'es' | 'fr' ;

@Injectable({
  providedIn: 'root'
})
export class LanguagesService {

  private readonly LANG_COOKIE_KEY = 'lang';
  private readonly DEFAULT_LANGUAGE: LANGUAGE = 'es';
  private readonly EXPIRATION_DAYS = 3*24*60*60; // 3 dias en segundos
  private readonly SUPPORTED_LANGUAGES: LANGUAGE[] = ['en', 'es', 'fr'];

  private cookie = inject(SsrCookieService);
  private plantformId = inject(PLATFORM_ID);
  private translate = inject(TranslateService);

  public setLanguageTranslate(lang: LANGUAGE) {

  }

  public currentLanguage = linkedSignal<LANGUAGE>(() => {
    const cookieValue = this.cookie.get(this.LANG_COOKIE_KEY) as LANGUAGE;
    console.debug(`🍪 [${this.plantformId}] Cookie leída:`, cookieValue);
    return cookieValue || this.DEFAULT_LANGUAGE;
  });

  public savedLangCookie = effect( () => {
    console.debug(`🍪 [${this.plantformId}] Gurando Idioma:`, this.currentLanguage());

    this.cookie.set( this.LANG_COOKIE_KEY ,this.currentLanguage(), {expires: this.EXPIRATION_DAYS}); // 3 dias
    this.translate.use(this.currentLanguage());
  });

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

  changeLanguage(lang: LANGUAGE) {
    console.debug('Cambiando idioma a:', lang);
    // Agregar cookie
    this.currentLanguage.set(lang);
  }


  changeLanguageFromString(lang: string) {

    if (this.isValidLanguage(lang)) {
      this.changeLanguage(lang);
      // TODO cambio de idoma
    } else {
      console.warn('Lenguaje no soportado:', lang);
    }
  }

  isValidLanguage(lang: string): lang is LANGUAGE {
    return this.SUPPORTED_LANGUAGES.includes(lang as LANGUAGE);
  }

  getSupportedLanguages(): LANGUAGE[] {
    return [...this.SUPPORTED_LANGUAGES];
  }
}

