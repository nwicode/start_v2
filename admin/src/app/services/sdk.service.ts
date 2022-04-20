import { Injectable } from '@angular/core';
import {RequestService} from "./request.service";

@Injectable({
  providedIn: 'root'
})
export class SdkService {

  constructor(private request:RequestService) { }

  public async checkSDK() {
    let result:any;
    try {
      let data =  await this.request.makePostRequest("api/checkSDK", {});
      data.is_error = false;
      result = data;
    } catch (error) {
      error.is_error = true;
      result = error;
    }
    return result;
  }

  public async installAndroidTools() {
    let result:any;
    try {
      let data =  await this.request.makePostRequest("api/installAndroidTools", {});
      data.is_error = false;
      result = data;
    } catch (error) {
      error.is_error = true;
      result = error;
    }
    return result;
  }  

  public async installGradle() {
    let result:any;
    try {
      let data =  await this.request.makePostRequest("api/installGradle", {});
      data.is_error = false;
      result = data;
    } catch (error) {
      error.is_error = true;
      result = error;
    }
    return result;
  }  

  public async installIonic() {
    let result:any;
    try {
      let data =  await this.request.makePostRequest("api/installIonic", {});
      data.is_error = false;
      result = data;
    } catch (error) {
      error.is_error = true;
      result = error;
    }
    return result;
  }  
}
