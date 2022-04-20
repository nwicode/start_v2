import {Injectable} from "@angular/core";
import {RequestService} from "./request.service";

@Injectable({
  providedIn: 'root'
})
export class ConstructorDasboardService {

  constructor(private request: RequestService) { }


    /**
     * Get dashbaord data for construcotr.
     *
     * @param appId application id
     */
     async getDashboard(appId) {
      let result: any;
      try {
          let data = await this.request.makePostRequest("api/dashboard", {id: appId });

          data.is_error = false;
          result = data;
      } catch (error) {
          error.is_error = true;
          result = error;
      }

      return result;
  }  
}
