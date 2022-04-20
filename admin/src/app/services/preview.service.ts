import { Injectable } from '@angular/core';
import {RequestService} from './request.service';
import {TokenService} from './token.service';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PreviewService {

  public preview_loader:string = environment.apiUrl + "ionic/preloader.html";

  constructor(private request:RequestService , private token: TokenService, private route: ActivatedRoute,private router: Router,) { }

  /**
   * get preview data, rin preview generate
   * @param id application ID
   * @returns 
   */
  public async get_preview(id:any, language:string = "") {

    let result:any;
    try {
      //console.log("do_login then data:");
      let data =  await this.request.makePostRequest("api/get_preview",{app_id:id,language:language});
      //console.log(data);
      data.is_error = false;
      result = data;
    } catch (error) {
      error.is_error = true;
      result = error;
    }
    return result;

  }


}
