import {Injectable} from '@angular/core';
import {BehaviorSubject, Subscription} from 'rxjs';
import {environment} from '../../environments/environment';
import {GoogleAnalyticRequest, GoogleAnalyticResponse} from '../constructor/dashboard/dashboard.objects';
import {HttpClient, HttpParams} from '@angular/common/http';
import {tap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class GoogleAnalyticsService {
    private item$ = new BehaviorSubject<GoogleAnalyticResponse>(new GoogleAnalyticResponse());
    private isLoading$ = new BehaviorSubject<boolean>(false);
    private errorMessage = new BehaviorSubject<string>('');
    private subscriptions: Subscription[] = [];

    constructor(private http: HttpClient) {
    }

    getAuthUrl(parameter: HttpParams = new HttpParams()) {
        return this.http.get(`${environment.apiUrl}api/google_analytics_auth_url`, {params: parameter})
            .pipe(tap((res: { result: string }) => {
                }),
            );
    }

    getAccessToken(parameter: HttpParams = new HttpParams()) {
        return this.http.get(`${environment.apiUrl}api/google_analytics_access_token`, {params: parameter})
            .pipe(tap((res: { result: { access_token: string, refresh_token: string } }) => {
                }),
            );
    }

    getRefreshedToken(parameter: HttpParams = new HttpParams()) {
        return this.http.get(`${environment.apiUrl}api/google_analytics_refreshed_access_token`, {params: parameter})
            .pipe(tap((res: { result: { access_token: string, refresh_token: string } }) => {
                }),
            );
    }

    fetchGoogleAnalyticReports(reportRequest: GoogleAnalyticRequest) {
        this.isLoading$.next(true);
        this.http.post(`${environment.apiUrl}api/google_analytics_reports`, reportRequest.toJson())
            .pipe(tap((res: GoogleAnalyticResponse) => {
                }),
            ).subscribe(result => {
            this.isLoading$.next(false);
            this.item$.next(result);
        }, error => {
            this.isLoading$.next(false);
        });
    }

    getGoogleAnalyticReports(reportRequest: GoogleAnalyticRequest) {
        this.isLoading$.next(true);
        return this.http.post(`${environment.apiUrl}api/google_analytics_reports`, reportRequest.toJson())
            .pipe(tap((res: GoogleAnalyticResponse) => {
                }),
            );
    }
}
