import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RequestsService {
    public apiRootUrl = environment.apiUrl + 'api/';

    constructor(private httpRequest: HttpClient) {
    }

    public sendGetRequest(routeName: string, token: string, parameter: HttpParams = new HttpParams()): Observable<any> {
        const header = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        });
        return this.httpRequest.get(this.apiRootUrl + routeName, {headers: header, params: parameter});
    }

    public sendCustomGetRequest(url: string, header: HttpHeaders = new HttpHeaders(), parameter: HttpParams = new HttpParams()): Observable<any> {
        return this.httpRequest.get(url, {headers: header, params: parameter});
    }


    public sendPostRequest(routeName: string, body: any, token: string, header: any = null, progress = true): Observable<any> {
        if (header == null) {
            header = new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
            });
        }
        console.log('FILE HEADER', header);
        return this.httpRequest.post(this.apiRootUrl + routeName, body, {headers: header, reportProgress: progress, observe: 'events'});
    }

    public sendPatchRequest(routeName: string, body: any, token: string): Observable<any> {
        const header = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
        });
        const param = new HttpParams().set('id', body.id);
        return this.httpRequest.patch(this.apiRootUrl + routeName, body, {headers: header, params: param, observe: 'events'});
    }

    public sendDeleteRequest(routeName: string, body: any, token: string): Observable<any> {
        const header = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
        });
        const param = new HttpParams().set('id', body.id);
        return this.httpRequest.delete(this.apiRootUrl + routeName, {headers: header, params: param});
    }
}
