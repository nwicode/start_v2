import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DynamicAsideMenuConfig } from '../../configs/dynamic-aside-menu.config';
import { UserService } from '../../../../services/user.service';
import { HttpClient } from '@angular/common/http';
import { RequestService } from '../../../../services/request.service';

const emptyMenuConfig = {
  items: []
};

@Injectable({
  providedIn: 'root'
})
export class DynamicAsideMenuService {
  private menuConfigSubject = new BehaviorSubject<any>(emptyMenuConfig);
  menuConfig$: Observable<any>;
  isLoading$ = new BehaviorSubject<boolean>(true);
  my_id : any;
  constructor(
    private userService: UserService,
    private request:RequestService,
    private http: HttpClient  
  ) {
    this.menuConfig$ = this.menuConfigSubject.asObservable();
    this.getSideMenu();
  }

  // Here you able to load your menu from server/data-base/localStorage
  // Default => from DynamicAsideMenuConfig
  private loadMenu() {
    
  }

  private setMenu(menuConfig) {
    this.menuConfigSubject.next(menuConfig);
  }

  private getMenu(): any {
    return this.menuConfigSubject.value;
  }

  public async getSideMenu() {
    let user = await this.userService.check_me();
    this.my_id = user.id
    let result:any;
    try {
      this.isLoading$.next(true);
      let data =  await this.request.makePostRequest('api/getsidemenu',{id:this.my_id});
      console.log("result: ", data)
      this.setMenu(data);
      this.isLoading$.next(false);
    } catch (error) {
      console.log("error: ", error)
    } 
    return result;    
  }
}
