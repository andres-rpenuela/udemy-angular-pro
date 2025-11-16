import {  effect, Inject, inject, Injectable, INJECTOR, linkedSignal, Optional, PLATFORM_ID, signal } from '@angular/core';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { TranslateService } from '@ngx-translate/core';
import { SERVER_LANGUAGE_TOKEN } from '../../tokens/language/server-language.token';
import { isPlatformServer } from '@angular/common';

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
  private platformId = inject(PLATFORM_ID);
  private translate = inject(TranslateService);


  public setLanguageTranslate(lang: LANGUAGE) {

  }

  public currentLanguage = linkedSignal<LANGUAGE>(() => {
    console.debug(`🔍 [${this.platformId}] Calculating current language...`);

    // ✅ PRIORIDAD 1: Idioma del servidor (solo en SSR)
    if (isPlatformServer(this.platformId) && this.serverLanguage) {
      console.debug(`🖥️ [SERVER] Using server language:`, this.serverLanguage);
      return this.serverLanguage;
    }

    // ✅ PRIORIDAD 2: Cookie
    const cookieValue = this.cookie.get(this.LANG_COOKIE_KEY) as LANGUAGE;
    console.debug(`🍪 [${this.platformId}] Cookie leída:`, cookieValue);

    if (cookieValue && this.isValidLanguage(cookieValue)) {
      console.debug(`✅ [${this.platformId}] Using cookie language:`, cookieValue);
      return cookieValue;
    }

    // ✅ PRIORIDAD 3: Default
    console.debug(`🔧 [${this.platformId}] Using default language:`, this.DEFAULT_LANGUAGE);
    return this.DEFAULT_LANGUAGE;
  });

  public savedLangCookie = effect(() => {
    const currentLang = this.currentLanguage();
    console.debug(`🍪 [${this.platformId}] Saving language:`, currentLang);

    // ✅ SOLO GUARDAR COOKIE EN EL CLIENTE
    if (!isPlatformServer(this.platformId)) {
      this.cookie.set(this.LANG_COOKIE_KEY, currentLang, { expires: this.EXPIRATION_DAYS });
      console.debug(`🍪 [CLIENT] Cookie saved:`, currentLang);
    } else {
      console.debug(`🖥️ [SERVER] Skipping cookie save on server`);
    }

    // ✅ APLICAR TRADUCCIÓN
    this.translate.use(currentLang);
  });


  // Da error de injección en el constructor, cuando se ejecuta en el cliente porque no es proveedio
  constructor(@Optional() @Inject(SERVER_LANGUAGE_TOKEN) private serverLanguage: LANGUAGE | null) {
    console.debug(`🚀 [${this.platformId}] LanguagesService initialized`);
    console.debug(`🖥️ [${this.platformId}] Server language from constructor:`, this.serverLanguage);
  }

  // constructor() {
  //     //se inyectara de manerr opcional
  //     if(this.plantformId === 'server'){
  //       const serverLanguage = inject(SERVER_LANGUAGE_TOKEN) as string;
  //       console.debug('Lenguaje del servidor:', serverLanguage);
  //     }
  //   }

  changeLanguage(lang: LANGUAGE) {
    if (this.isValidLanguage(lang)) {
      console.debug(`🔄 [${this.platformId}] Changing language to:`, lang);
      this.currentLanguage.set(lang);
    } else {
      console.warn(`⚠️ [${this.platformId}] Invalid language:`, lang);
    }
  }

  changeLanguageFromString(lang: string) {
    if (this.isValidLanguage(lang)) {
      this.changeLanguage(lang);
    } else {
      console.warn(`⚠️ [${this.platformId}] Unsupported language:`, lang);
    }
  }

  isValidLanguage(lang: string): lang is LANGUAGE {
    return this.SUPPORTED_LANGUAGES.includes(lang as LANGUAGE);
  }

  getSupportedLanguages(): LANGUAGE[] {
    return [...this.SUPPORTED_LANGUAGES];
  }

  // ✅ MÉTODO PARA DEBUGGING
  getDebugInfo() {
    return {
      platform: this.platformId,
      serverLanguage: this.serverLanguage,
      currentLanguage: this.currentLanguage(),
      cookieValue: this.cookie.get(this.LANG_COOKIE_KEY),
      supportedLanguages: this.SUPPORTED_LANGUAGES
    };
  }
}

