import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from '../../../../services/user.service';
import { RequestService } from '../../../../services/request.service';
import {Router} from "@angular/router";

const emptyMenuConfig = {
    items: []
};

@Injectable()
/**
 * Methods and properties for constructor aside menu.
 */
export class ConstructorDynamicAsideMenuService {
    private menuConfigSubject = new BehaviorSubject<any>(emptyMenuConfig);
    menuConfig$: Observable<any>;
    isLoading$ = new BehaviorSubject<boolean>(true);

    user_id : any;
    appId: any;

    constructor(private userService: UserService, private request:RequestService, private router: Router) {
        this.menuConfig$ = this.menuConfigSubject.asObservable();
        this.getSideMenu();
    }

    private setMenu(menuConfig) {
        this.menuConfigSubject.next(menuConfig);
    }

    /**
     * Return list items for constructor aside menu.
     */
    public async getSideMenu() {
        let user = await this.userService.check_me();
        this.user_id = user.id
        this.appId = Number(this.router.url.match(/constructor\/(\d+)/)[1]);

        let result: any;
        try {
            this.isLoading$.next(true);
            let data =  await this.request.makePostRequest('api/getConstructorSideMenu',{userId: this.user_id, appId: this.appId});
            data.is_error = false;
            result = data;
            this.setMenu(data);
            this.isLoading$.next(false);
        } catch (error) {
            error.is_error = true;
            result = error;
            console.log("error: ", error)
        }
        return result;
    }
}
