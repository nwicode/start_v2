// Localization is based on '@ngx-translate/core';
// Please be familiar with official documentations first => https://github.com/ngx-translate/core

import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {laguageSettings} from '../../../assets/languages/languages';

const LOCALIZATION_LOCAL_STORAGE_KEY = 'nwicode_language';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  // Private properties
  private langIds: any = [];

  constructor(private translate: TranslateService) { 
    let langs = [];
    laguageSettings.languages.forEach(element => {
     langs.push(element.code);
    });
  }


  setInitialAppLanguage() {
    this.translate.setDefaultLang(laguageSettings.default);
    let current = this.getSelectedLanguage();
    console.log("Current lang "+current);
    this.setLanguage(current);
    
  }

  setLanguage(lang) {
    if (lang) {
      this.translate.use(this.translate.getDefaultLang());
      this.translate.use(lang);
      localStorage.setItem(LOCALIZATION_LOCAL_STORAGE_KEY, lang);
    }
  }

  /**
   * Returns selected language
   */
  getSelectedLanguage(): any {
    return (
      localStorage.getItem(LOCALIZATION_LOCAL_STORAGE_KEY) ||
      this.translate.getDefaultLang()
    );
  }

  /**
   * return array with available languages
   * @returns languages array
   */
  getAvailableLanguages() {
    return laguageSettings.languages;
  }

  /**
   * Return translated phrase
   * @param phrase pharse to translate
   * @returns translated pharse
   */
  translatePhrase(phrase:string) {
    return this.translate.instant(phrase);
  }

}
