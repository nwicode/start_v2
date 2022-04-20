import {Injectable} from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TokenService} from '../services/token.service';

@Injectable()
export class AuthInterceptorInterceptor implements HttpInterceptor {

    constructor(private token: TokenService) {
    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        //console.log('AuthInterceptorInterceptor', request.url);
        if (request.headers.get('GALLERY_UPLOAD') === 'GALLERY_UPLOAD') {
            request = request.clone();
            request.headers.set('Authorization', `Bearer ` + this.token.get());
        }
        else if (request.url.includes('system_settings.json')) {
            request.headers.set('Authorization', 'Bearer ' + this.token.get());
        }
        else {
            // request.headers.set('Authorization', 'Bearer ' + this.token.get());

            request = request.clone({
                setHeaders: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ` + this.token.get(),
                },
            });
        }

        return next.handle(request);
    }
}
