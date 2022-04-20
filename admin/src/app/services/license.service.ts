import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {ILicense, License, LicenseState} from '../platform/Pages/market-place/market-place.objects';
import {map, tap} from 'rxjs/operators';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {RequestService} from "./request.service";

@Injectable({
    providedIn: 'root'
})
export class LicenseService {
    private API_URL = `${environment.apiUrl}api/licenses/`;
    public license = new BehaviorSubject<License>(License.factory());
    public licenseState = new BehaviorSubject<LicenseState>(LicenseState.factory());
    public isLoading = new BehaviorSubject<boolean>(false);
    public isCompleted = new BehaviorSubject<boolean>(true);
    private errorMessage = new BehaviorSubject<string>('');
    private subscriptions: Subscription[] = [];

    constructor(private http: HttpClient, private request:RequestService) {
    }

    public getLicense() {
        this.isLoading.next(true);
        this.isCompleted.next(false);
        this.http.get(this.API_URL + 'getLicense').pipe(tap((res: { result: ILicense }) => {
        })).subscribe(result => {
            this.isLoading.next(false);
            this.isCompleted.next(true);
            this.license.next(License.getData(result.result));
        }, error => {
            this.isLoading.next(false);
            this.isCompleted.next(true);
        });
    }

    public activateLicense(licenseData: any): Observable<LicenseState> {
        this.isLoading.next(true);
        return this.http.post(this.API_URL + 'activate', licenseData).pipe(tap((res: LicenseState) => {
        }));
    }

    public checkLicense(licenseData: any):Promise<any> {
        this.isLoading.next(true);
        this.isCompleted.next(false);
        return this.http.post(this.API_URL + 'verify', licenseData).toPromise();
    }

    async checkUpdates() {
        let result: any;
        try {
            result = await this.request.makePostRequest('api/licenses/checkupdates', {});
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }

    async verifyLicense() {
        let result: any;
        try {
            result = await this.request.makePostRequest('api/licenses/verify', {});
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }

    async runUpdate() {
        let result: any;
        try {
            result = await this.request.makePostRequest('api/licenses/runUpdate', {});
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }

    public deactivateLicense(licenseData: any): Observable<LicenseState> {
        this.isLoading.next(true);
        return this.http.post(this.API_URL + 'deactivate', licenseData).pipe(tap((res: LicenseState) => {
        }));
    }
}
