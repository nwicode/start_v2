import { Injectable } from '@angular/core';
import {RequestService} from './request.service';
import { Observable, Subject, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  private subject = new Subject<any>();
  notifcations:any;

  constructor(public request:RequestService) { }

   /**
   * load all notifications data
   * @returns operation result
   */
  
    public async loadNotifications() {
      let result:any;
      try {
          console.log("Get new unread notify:");
          let data =  await this.request.makePostRequest("api/short_notification", {});
          result = data;
          console.log(data);
          result = data;
          //console.log("Print result in service: ", JSON.stringify(result));
          this.subject.next({ result });
        } catch (error) {
          console.log("function loadNotifications() failed with an error");
          error.is_error = true;
          result = error;
        }    
        return result;
    }
  

  /**
   * get all notifications from loadNotifications().subject
   * @returns asObservable();
   */

    getNotifications(): Observable<any> {
        return this.subject.asObservable();
    }
}
