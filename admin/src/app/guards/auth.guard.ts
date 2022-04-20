import {Injectable} from '@angular/core';
import {
    Router,

    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    ActivatedRoute,
} from '@angular/router';
import {UserService} from '../services/user.service';


@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
    constructor(private userService: UserService, private router: Router, private _route: ActivatedRoute) {
    }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        let user_check_result = await this.userService.check_me();

        if (user_check_result.logined) {
            // logged in so return true
            return true;
        } else {

            this._route.params.subscribe((params: any) => {
                if (params['refer']) {
                    document.body.classList.remove('dark-theme');
                    this.router.navigate(['/auth/login', params['refer']], {relativeTo: this._route});
                } else {
                    document.body.classList.remove('dark-theme');
                    this.router.navigate(['/auth/login'], {relativeTo: this._route});
                }
            });


        }

    }
}
