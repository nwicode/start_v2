import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, ActivatedRoute} from '@angular/router';
import {Observable, of} from 'rxjs';
import {UserService} from '../services/user.service';
import {Subscription} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RoleAdminGuard implements CanActivate {

    userUpdateSubscription: Subscription;
    userCurrent: any;

    constructor(private userService: UserService, private router: Router, private _route: ActivatedRoute) {

    }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        console.log('canActivate', );
        // bypass the form guard based on navigation state
        // (used when navigating out after form submit)
        const navObject = this.router.getCurrentNavigation();
        if (navObject && navObject.extras.state && navObject.extras.state.bypassFormGuard) {
            return true;
        }


        let roles = route.data.roles as Array<string>;

        this.userCurrent = await this.userService.check_me();

        return true;
    }


}
