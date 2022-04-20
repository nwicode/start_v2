import { Injectable } from '@angular/core';
import {RequestService} from "./request.service";

export interface Tarif {
  id: number|string,
  tarifTextData: {lang_id: number, tarif_id: number|string, name: string, description: string}[],
  cost_month: number,
  cost_year: number,
  application_count: number,
  sort: number,
  pwa: boolean,
  android: boolean,
  ios: boolean,
  disk_space: number,
  managers_count: number,
  preselected: boolean,
  active: boolean,
  whitelabel: boolean,
  max_build_count: number
}

@Injectable({
  providedIn: 'root'
})
export class TarifService {

  constructor(private request:RequestService) { }

  /**
   *Load tariff by id.
   *
   * @param tarif_id
   */
  public async loadTarif(tarif_id: number|string) {
    let result:any;
    try {
      let data =  await this.request.makePostRequest("api/getTarif", {tarif_id: tarif_id});
      data.is_error = false;
      result = data;
    } catch (error) {
      error.is_error = true;
      result = error;
    }
    return result;
  }

  /**
   * Load all tariffs with certain language.
   *
   * @param lang_code
   */
  public async loadTarifs(lang_code: number|string) {
    let result:any;
    try {
      let data =  await this.request.makePostRequest("api/getTarifs", {lang_code: lang_code});
      data.is_error = false;
      result = data;
    } catch (error) {
      error.is_error = true;
      result = error;
    }
    return result;
  }

  /**
   * Update tariff information.
   *
   * @param tarif_data
   */
  public async updateTarif(tarif_data: object) {
    let result:any;
    try {
      let data =  await this.request.makePostRequest("api/updateTarif", tarif_data);
      data.is_error = false;
      result = data;
    } catch (error) {
      error.is_error = true;
      result = error;
    }
    return result;
  }

  /**
   * Create new tariff.
   *
   * @param tarif_data
   */
  public async createTarif(tarif_data: Tarif) {
    let result:any;
    try {
      let data =  await this.request.makePostRequest("api/createTarif", tarif_data);
      data.is_error = false;
      result = data;
    } catch (error) {
      error.is_error = true;
      result = error;
    }
    return result;
  }

  /**
   * Delete tariff.
   *
   * @param tarif_id
   */
  public async deleteTarif(tarif_id: number|string) {
    let result:any;
    try {
      let data =  await this.request.makePostRequest("api/deleteTarif", {tarif_id: tarif_id});
      data.is_error = false;
      result = data;
    } catch (error) {
      error.is_error = true;
      result = error;
    }
    return result;
  }
}
