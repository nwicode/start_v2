import { Injectable } from '@angular/core';
import {environment} from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})

/**
 * Autenthicate token service
 */
export class TokenService {

  private iss = {
    login: environment.apiUrl+"api/login",
    signup: environment.apiUrl+"api/signup"
  }


  constructor() { }


  handle(access_token: any) {
    this.set(access_token);
    console.log(this.isValid());
  }

  /**
   * Store token to localstorage
   * @param token token to store
   */
  set(token:any) {
    localStorage.setItem(environment.appPrefix+"token",token);
  }

  /**
   * Get tokenfrom localstorage
   * @returns token
   */
  get() {
    return localStorage.getItem(environment.appPrefix+"token");
  }

  /**
   * Remove token from local storage
   */
  remove() {
    localStorage.removeItem(environment.appPrefix+"token");
  }

  
  isValid() {
    let token = this.get();
    if (token) {
      let payload = this.payload(token);

      if (payload) {
        //return (payload.iss === environment.apiUrl+"api/login") ? true : false;
        return Object.values(this.iss).indexOf(payload.iss)>-1 ? true : false;
      }
    }

    return false;
  }


  /**
   * Extract JSON from token
   * @param token 
   * @returns json data
   */
  payload(token: string) {
    let payload =  token.split('.')[1];
    return this.decode(payload);
  }



  /**
   * Decode token record
   * @param payload split part of token
   * @returns json token info
   */
  decode(payload: string) {
    return JSON.parse(atob(payload));
  }

}
