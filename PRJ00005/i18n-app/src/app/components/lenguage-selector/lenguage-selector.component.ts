import { Component, inject, OnInit, signal } from '@angular/core';
import { LANGUAGE, LanguagesService } from '../../services/language/languages.service';

@Component({
  selector: 'app-lenguage-selector',
  templateUrl: './lenguage-selector.component.html',
  styleUrls: ['./lenguage-selector.component.css']
})
export class LenguageSelectorComponent implements OnInit {

  languages = signal([
    { code: 'en', flag: '🇺🇸' },
    { code: 'es', flag: '🇪🇸' },
    { code: 'fr', flag: '🇫🇷' },
    { code: 'it', flag: '🇮🇹' },
  ]);

  languageServices = inject(LanguagesService);

  constructor() { }

  ngOnInit() {
  }

  /**
   * Procedimiento que se invoca al cambiar el lenguaje en el selecto al hacer click
   * @param event
   */
  changeLanguage(event : Event) {
    const selectElement = event.target as HTMLSelectElement;

    const selectedLanguage = selectElement.value;
    //console.debug('Lenguaje seleccionado:', selectedLanguage);

    this.languageServices.changeLanguageFromString(selectedLanguage);

  }

  get currentLanguage() {
    return this.languageServices.currentLanguage;
  }
}
