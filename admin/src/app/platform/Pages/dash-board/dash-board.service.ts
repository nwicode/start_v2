import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { UserModel } from 'src/app/modules/auth/_models/user.model';
import {UserService} from '../../../services/user.service';
 
@Injectable({providedIn:'root'})
export class ApiService {
 
  my_id : any;
  
  constructor(
    private http: HttpClient,
    private user: UserService
  ) {
    this.user.check_me().then( res => {this.my_id = res.id});
  }
 
  buildtranslations() {
    console.log('buildtranslations')
    return this.http.get(environment.apiUrl+'api/buildtranslations')
  }
 
  getstaticpage() {
    console.log('getstaticpage')
    return this.http.get(environment.apiUrl+'api/getstaticpage?lang=ru&code=terms')
  }
 
  setTestActivity() {
    console.log('setTestActivity')
    return this.http.get(environment.apiUrl+'api/setactivitylog?user_id='+this.my_id+'&app_id=0&name=Click on button&text=User click on button')
  }
 
  getTestActivity() {
    console.log('getTestActivity')
    return this.http.get(environment.apiUrl+'api/getactivitylog?user_id='+this.my_id+'&app_id=0')
  }
 
}