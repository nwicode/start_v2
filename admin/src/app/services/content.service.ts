import { Injectable } from '@angular/core';
import { RequestService } from './request.service';

@Injectable({
  providedIn: 'root'
})
/**
 * Methods and properties for static pages.
 */
export class ContentService {

  constructor(private request: RequestService) { }

  /**
   * get static pages by codes array from server
   * @param pages string array of page code
   * @returns response from static_pages table
   */
  public async downloadStaticPages(pages:string[]) {
    let result: any;
    try {
      result =  await this.request.makePostRequest('api/getStaticPagesByCodes', { codes: pages });
    } catch (error) {
      error.is_error = true;
      result = error;
    }

    return result;
  }

  /**
   * Get static page with param code.
   *
   * @param code
   * @return operation result
   */
  public async downloadStaticPage(code: string) {
    let result: any;
    try {
      result =  await this.request.makePostRequest('api/getStaticPagesByCode', { code: code });
    } catch (error) {
      error.is_error = true;
      result = error;
    }

    return result;
  }

  /**
   * Get static pages headers.
   *
   * @param language
   * @return operation result
   */
  public async downloadStaticPagesHeaders(language: string){
    let result: any;
    try {
      result =  await this.request.makePostRequest('api/getStaticPagesHeaders', { lang: language });
    } catch (error) {
      error.is_error = true;
      result = error;
    }

    return result;
  }

  /**
   * Update static pages.
   *
   * @param pages
   * @return operation result
   */
  public async updateStaticPages(pages: object[]) {
    let result: any;
    try {
      result =  await this.request.makePostRequest('api/updateStaticPages', { staticPages: pages });
    } catch (error) {
      error.is_error = true;
      result = error;
    }

    return result;
  }

  /**
   * Update meta settings
   * @param metas - array with meta data
   * @returns response
   */
  public async updateMetas(metas:any) {
    let result: any;
    try {
      result =  await this.request.makePostRequest('api/updateMetaPages', { metas:metas });
    } catch (error) {
      error.is_error = true;
      result = error;
    }

    return result;
  }

  /**
   * Get static page related with mail template.
   *
   * @param code
   * @return operation result
   */
  public async getMailStaticPage(code: string) {
    let result: any;
    try {
      result =  await this.request.makePostRequest('api/getMailStaticPage', { code: code  });
    } catch (error) {
      error.is_error = true;
      result = error;
    }

    return result;
  }
}
