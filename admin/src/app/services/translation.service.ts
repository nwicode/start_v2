// Localization is based on '@ngx-translate/core';
// Please be familiar with official documentations first => https://github.com/ngx-translate/core

import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
//import {laguageSettings} from '../../assets/languages/languages';
import {RequestService} from './request.service';
import {environment} from "../../environments/environment";
import {TokenService} from "./token.service";
import { HttpClient } from '@angular/common/http';

const LOCALIZATION_LOCAL_STORAGE_KEY = 'nwicode_language';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {

  // Private properties
  private langIds: any = [];

  private languageSettings: any = {};

  private languagesUrl = 'assets/languages/languages.json';

  constructor(private http: HttpClient, private translate: TranslateService, private request:RequestService, private token: TokenService) {
    let langs = [];

    /*laguageSettings.languages.forEach(element => {
     langs.push(element.code);
    });*/

    this.readLanguages();
  }

  async readLanguages() {
    this.languageSettings = await this.http.get(environment.apiUrl + this.languagesUrl).toPromise();
  }

  setInitialAppLanguage() {
    this.translate.setDefaultLang(this.languageSettings.default);
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
    return this.languageSettings.languages;
  }

  /**
   * Return translated phrase
   * @param phrase pharse to translate
   * @returns translated pharse
   */
  translatePhrase(phrase:string) {
    return this.translate.instant(phrase);
  }

  /**
   * Set system defaul languge
   * @param code language code
   * @returns response result
   */
  async updateSystemDefaultLanguage(code: string) {
    let result: any;
    try { 
      let data = await this.request.makePostRequest("api/set_default_language", { code: code });

      data.is_error = false;
      result = data;
    } catch (error) {
      console.log("updateSystemDefaultLanguage error");
      error.is_error = true;
      result = error;
    }
    return result;
  }  

/**
 * Add new language to system
 * @param name langauge name
 * @param code laguage code
 * @param flag bse64 flag image
 * @returns response result
 */
  async addLanguage(name:string, code:string, flag:string) {
    let result: any;
    try { 
      let data = await this.request.makePostRequest("api/add_language", { code: code, name:name, flag: flag });

      data.is_error = false;
      result = data;
    } catch (error) {
      console.log("addLanguage error");
      error.is_error = true;
      result = error;
    }
    return result;
  }


/**
 * remove language from system
 * @param code laguage code
 * @returns response result
 */
 async deleteLanguage(code:string) {
  let result: any;
  try { 
    let data = await this.request.makePostRequest("api/delete_language", { code: code });

    data.is_error = false;
    result = data;
  } catch (error) {
    console.log("deleteLanguage error");
    error.is_error = true;
    result = error;
  }
  return result;
}

/**
 * Load translation list for lang id
 * @param name langauge name
 * @param code laguage code
 * @param flag bse64 flag image
 * @returns response result
 */
  async loadtranslations(id:any) {
    let result: any;
    try { 
      let data = await this.request.makePostRequest("api/get_translations", { id: id });

      data.is_error = false;
      result = data;
    } catch (error) {
      console.log("loadtranslations error");
      error.is_error = true;
      result = error;
    }    
    return result;
  }


  async updateTranslations(translations: any) {
    let result: any;
    try { 
      let data = await this.request.makePostRequest("api/update_translations", { translations: translations });

      data.is_error = false;
      result = data;
    } catch (error) {
      console.log("updateTranslations error");
      error.is_error = true;
      result = error;
    }    
    return result;
  }

  /**
   * Send language pack to server
   *
   * @param zipPack
   * @returns response result
   */
  async downloadLanguagePack(zipPack: File): Promise<any> {
    let result: any;
    try {
      let formData = new FormData();
      formData.append('zip', zipPack);

      let data;
      await fetch(environment.apiUrl + 'api/download_language_pack', {
        method:'POST',
        body: formData,
        headers: {'Authorization': 'Bearer ' + this.token.get()}
      }).then(response => {
        if (response.status >= 400 && response.status < 600) {
          throw new Error(response.statusText);
        }
        data = response;
        data.is_error = false;
        result = data;
      });
    } catch (error) {
      error.is_error = true;
      result = error;
    }

    return result;
  }
}
