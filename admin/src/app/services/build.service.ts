/**
 * Build application service
 */
import {Injectable} from "@angular/core";
import {RequestService} from "./request.service";
import {IAP, IAP_language} from '../interfaces/iap';
import { Observable, Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BuildService {

  constructor(private request: RequestService) { }


  /**
   * Load current application build queue
   * 
   * @param appId application id
   */
  async loadQueue(appId) {
    let result: any;
    try {
      result = await this.request.makePostRequest('api/getQueue', {app_id: appId});
    } catch (error) {
      error.is_error = true;
      result = error;
    }

    return result;
  }


  /**
   * Load build queue list.
   *
   * @param page page number
   * @param perPage items per page
   * @param orderBy sort field
   * @param orderDirection sort direction
   */
  async loadBuildQueueList(page, perPage, orderBy, orderDirection) {
    let result: any;
    try {
      result = await this.request.makePostRequest('api/getBuildQueueList', {
        page: page,
        perPage: perPage,
        orderBy: orderBy,
        orderDirection: orderDirection
      });
    } catch (error) {
      error.is_error = true;
      result = error;
    }

    return result;
  }

  /**
   * Delete records in build queue.
   *
   * @param delete_arr array with deleted items id.
   */
  async deleteBuildQueue(delete_arr: any[]) {
    let result: any;
    try {
      result = await this.request.makePostRequest('api/deleteBuildQueue', {
        delete_array: delete_arr
      });
    } catch (error) {
      error.is_error = true;
      result = error;
    }

    return result;
  }



  /**
   * Run android debug APK generation
   *
   * @param appId application id
   */
  async buildAndroidDebug(appId) {
    let result: any;
    try {
      let data = await this.request.makePostRequest("api/buildAndroid", {
        app_id: appId,
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
   * Run WWW generation
   *
   * @param appId application id
   */
  async buildWWW(appId) {
    let result: any;
    try {
      let data = await this.request.makePostRequest("api/buildWWW", {
        app_id: appId,
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
   * Run android source K generation
   *
   * @param appId application id
   */
  async buildAndroidSrc(appId) {
    let result: any;
    try {
      let data = await this.request.makePostRequest("api/buildAndroidSrc", {
        app_id: appId,
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
   * Run ios source generation.
   *
   * @param appId application id
   */
  async buildIOSSrc(appId) {
    let result: any;
    try {
      let data = await this.request.makePostRequest("api/buildIOSSrc", {
        app_id: appId,
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
