import { Injectable } from '@angular/core';
import {RequestService} from './../../../services/request.service';
 
@Injectable({providedIn:'root'})
export class CurrencyService {
  
  constructor(private request:RequestService){}
  
 /**
  * update System Default Currency
  *
  * @param {string} code
  * @return {*} 
  * @memberof CurrencyService
  */
 async updateSystemDefaultCurrency(code: string) {
    let result: any;
    try { 
      let data = await this.request.makePostRequest("api/setdefaultcurrency", { code: code });
      data.is_error = false;
      result = data;
    } catch (error) {
      console.log("updateSystemDefaultCurrency error");
      error.is_error = true;
      result = error;
    }
    return result;
  }

 /**
  * get System Default Currency
  *
  * @return {*} 
  * @memberof CurrencyService
  */
 async getSystemDefaultCurrency() {
    let result: any;
    try { 
      let data = await this.request.makePostRequest("api/getdefaultcurrency", {});
      data.is_error = false;
      result = data;
    } catch (error) {
      console.log("updateSystemDefaultCurrency error");
      error.is_error = true;
      result = error;
    }
    return result;
  }
 
}