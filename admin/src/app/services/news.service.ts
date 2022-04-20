import { Injectable } from '@angular/core';
import {RequestService} from "./request.service";

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(private request:RequestService) { }


    /**
   * Load news list
   * 
   */
     async getNews() {
      let result: any;
      try {
        result = await this.request.makePostRequest('api/getNews', {});
      } catch (error) {
        error.is_error = true;
        result = error;
      }
  
      return result;
    }

    /**
   * Load news list
   * 
   */
     async getNewsList() {
      let result: any;
      try {
        result = await this.request.makePostRequest('api/getNewsList', {});
      } catch (error) {
        error.is_error = true;
        result = error;
      }
  
      return result;
    }



    /**
   * Load news
   * 
   */
     async getNewsItem(item_id:any) {
      let result: any;
      try {
        result = await this.request.makePostRequest('api/getNewsItem', {id:item_id});
      } catch (error) {
        error.is_error = true;
        result = error;
      }
  
      return result;
    }



    async updateNewsItem(item_id: any, form:any) {
    let result: any;
    try {
      result = await this.request.makePostRequest('api/updateNewsItem', {id:item_id, form:form});
    } catch (error) {
      error.is_error = true;
      result = error;
    }

    return result;
  } 

    async removeNewsItem(item_id: any, ) {
    let result: any;
    try {
      result = await this.request.makePostRequest('api/removeNewsItem', {id:item_id});
    } catch (error) {
      error.is_error = true;
      result = error;
    }

    return result;
  }    
}
