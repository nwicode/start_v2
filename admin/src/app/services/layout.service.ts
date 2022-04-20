/**
 * Service for layouts in constructor page
 */

import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {RequestService} from "./request.service";

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  
  //close side menu event
  private sideCloseButtonSubject = new Subject<any>();
  
  //clock side menu event
  private sideClickButtonSubject = new Subject<any>();

  //sideComponentAction event
  private sideActionSubject = new Subject<any>();
  
  
  constructor(private request: RequestService) { }

  /**
   * Close button press observable
   * @returns Observable
   */
  onSideCloseButtonPressed(): Observable<any> {
    return this.sideCloseButtonSubject.asObservable();
  }


  /**
   * Click side menu button
   * @returns Observable
   */
  onSideButtonPressed(): Observable<any> {
    return this.sideClickButtonSubject.asObservable();
  }

  /**
   * Call close side menu event
   */
  public closeSideComponentPanelEvent() {
    this.sideCloseButtonSubject.next({});
  }


  /**
   * Call click side menu event
   */
  public clickComponentPanelEvent() {
    this.sideClickButtonSubject.next({});
  }

  /**
   * Some action in side component action observable
   * @returns Observable
   */
   onSideActionSubject(): Observable<any> {
    return this.sideActionSubject.asObservable();
  }


  /**
   * Call from service
   * @param form form object
   */
  public createActionEvent(event:string, form:any) {
    this.sideActionSubject.next({event:event, data:form});
  }

   /**
     * Get pages data
     *
     * @param appId application id
     */
  async getPages(appId) {
    let result: any;
    try {
        let data = await this.request.makePostRequest("api/appPages", {id: appId });

        data.is_error = false;
        result = data;
    } catch (error) {
        error.is_error = true;
        result = error;
    }

    return result;
  }  

  /**
   * get page data
   * @param appId application id
   * @param page_id page id
   * @returns data repsonse from core
   */
  async getPageData(appId:number, page_id:number) {
    let result: any;
    try {
        let data = await this.request.makePostRequest("api/getPageData", {id: appId, page_id:page_id });

        data.is_error = false;
        result = data;
    } catch (error) {
        error.is_error = true;
        result = error;
    }

    return result;
  }

  /**
   * store page data to server
   * @param appId application id
   * @param page_id page id
   * @param page_settings page settings
   * @returns data repsonse from core
   */
  async setPageData(appId:number, page_id:number, page_settings:any) {
    let result: any;
    try {
        let data = await this.request.makePostRequest("api/setPageData", {id: appId, page_id:page_id,page_settings:page_settings });

        data.is_error = false;
        result = data;
    } catch (error) {
        error.is_error = true;
        result = error;
    }

    return result;
  }

/**
 * update page position
 * @param appId app id
 * @param page_id page_id (from core)
 * @param left lest pos
 * @param top top tops
 * @param height height
 * @param width width
 * @returns response from core
 */
  async updatePagePos(appId:number, page_id:number, left:number, top: number, height:number, width:number) {
    let result: any;
    try {
        let data = await this.request.makePostRequest("api/updatePagePos", {id: appId, page_id:page_id, left:left, top:top, width:width, height:height });

        data.is_error = false;
        result = data;
    } catch (error) {
        error.is_error = true;
        result = error;
    }

    return result;
  }

  /**
   * Add page to app
   * @param appId app id
   * @param name page name
   * @param type page type
   * @param left left pos
   * @param top top pos
   * @param height height
   * @param width width
   * @returns core respose
   */
  async addPage(appId:number, name:string, type:string, left:number, top: number, height:number, width:number) {
    let result: any;
    try {
        let data = await this.request.makePostRequest("api/addPage", {id: appId, name:name, type:type, left:left, top:top, width:width, height:height });

        data.is_error = false;
        result = data;
    } catch (error) {
        error.is_error = true;
        result = error;
    }

    return result;
  }

   /**
     * Get layout items (pages, buttons, lists and other for component library)
     *
     * @param appId application id
     */
    async getlayoutItems(appId) {
      let result: any;
      try {
          let data = await this.request.makePostRequest("api/getlayoutItems", {id: appId });
  
          data.is_error = false;
          result = data;
      } catch (error) {
          error.is_error = true;
          result = error;
      }
  
      return result;
    } 

    /**
     * Remove page from application
     * @param appId application id
     * @param page_id page id
     * @returns core response
     */
    async removePage(appId:number, page_id:number) {
      let result: any;
      try {
          let data = await this.request.makePostRequest("api/removePage", {id: appId, page_id:page_id});
  
          data.is_error = false;
          result = data;
      } catch (error) {
          error.is_error = true;
          result = error;
      }
  
      return result;
    }

    /**
     * Get application page custom code.
     *
     * @param appId application id
     * @param page_id application page id
     */
    async getPageCustomCode(appId:number, page_id:number) {
        let result: any;
        try {
            let data = await this.request.makePostRequest("api/getPageCustomCode", {appId: appId, pageId:page_id});

            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }


    /**
     * Set application page custom code values.
     *
     * @param appId application id
     * @param page_id application page id
     * @param code_values
     */
    async setPageCustomCode(appId:number, page_id:number, code_values: object) {
        let result: any;
        try {
            let data = await this.request.makePostRequest("api/setPageCustomCode", {
                appId: appId,
                pageId: page_id,
                code_values: code_values
            });

            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }



    /**
     * set application component
     * @param appId appliation id
     * @param page_id page id
     * @param component component data
     */
    async addPageComponent (appId:number, page_id:number, component: any) {
      let result: any;
      try {
          let data = await this.request.makePostRequest("api/setPageComponent", {
              appId: appId,
              pageId: page_id,
              component: component
          });

          data.is_error = false;
          result = data;
      } catch (error) {
          error.is_error = true;
          result = error;
      }

      return result;
    }

    /**
     * Get application colors
     * @param appId application ID
     * @returns response
     */
    async getApplicationColorsInLayouts(appId:number) {
      let result: any;
      try {
          let data = await this.request.makePostRequest("api/getApplicationColorsInLayouts", {
            id: appId,
          });

          data.is_error = false;
          result = data;
      } catch (error) {
          error.is_error = true;
          result = error;
      }

      return result;      
    }

    /**
     * Set application colors
     * @param appId application ID
     * @returns response
     */
    async setApplicationColorsInLayouts(appId:number,colors:any) {
      let result: any;
      try {
          let data = await this.request.makePostRequest("api/setApplicationColorsInLayouts", {
            id: appId,
            colors: colors,
          });

          data.is_error = false;
          result = data;
      } catch (error) {
          error.is_error = true;
          result = error;
      }

      return result;      
    }

    /**
     * get components from page
     * @param appId app id
     * @param page_id page id
     * @returns responese
     */
    async getPageComponents(appId:number, page_id:number) {
      let result: any;
      try {
          let data = await this.request.makePostRequest("api/getPageComponents", {
              appId: appId,
              pageId: page_id,
          });

          data.is_error = false;
          result = data;
      } catch (error) {
          error.is_error = true;
          result = error;
      }

      return result;      
    }

    /**
    * get components from page
    * @param appId app id
    * @param component_id page id
    * @returns responese
    */
    async deleteComponentFromPage(appId: number, component_id: any) {
      let result: any;
      try {
          let data = await this.request.makePostRequest("api/deleteComponentFromPage", {
              appId: appId,
              component_id: component_id,
          });

          data.is_error = false;
          result = data;
      } catch (error) {
          error.is_error = true;
          result = error;
      }

      return result; 
    }

    /**
     * Store component form data to core
     * @param appId application id
     * @param page_id page id
     * @param component_id component_id on page
     * @param component_data component data form
     * @param position_data position data
     * @returns 
     */
    async updatePageComponent(appId:number, page_id:number, component_id:number, component_data:any, position_data:any = {}, visibility:any = {}) {
      let result: any;
      try {
          let data = await this.request.makePostRequest("api/updatePageComponentData", {
              appId: appId,
              pageId: page_id,
              component_id: component_id,
              component_data: component_data,
              position_data: position_data,
              visibility: visibility,
          });

          data.is_error = false;
          result = data;
      } catch (error) {
          error.is_error = true;
          result = error;
      }

      return result;        
    }    


    /**
     * Update components positions in core
     * @param appId application id
     * @param page_id page id
     * @param positions array with positions
     * @returns response
     */
    async updateComponentsPosition(appId:number, page_id:number,  positions: any) {
      let result: any;
      try {
          let data = await this.request.makePostRequest("api/updateComponentsPosition", {
              appId: appId,
              pageId: page_id,
              positions: positions,
          });

          data.is_error = false;
          result = data;
      } catch (error) {
          error.is_error = true;
          result = error;
      }

      return result; 
    }    
    
    /**
     * get array for leader line
     * @param appId application id
     * @returns response
     */

    async getLines(appId:number,) {
      let result: any;
      try {
          let data = await this.request.makePostRequest("api/getPageLines", {
              appId: appId,
          });

          data.is_error = false;
          result = data;
      } catch (error) {
          error.is_error = true;
          result = error;
      }

      return result; 
    }

}
