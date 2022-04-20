import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from './../../environments/environment';
import {TokenService} from './token.service';
import {TranslateService} from '@ngx-translate/core';

const LOCALIZATION_LOCAL_STORAGE_KEY = 'nwicode_language';

@Injectable({
    providedIn: 'root'
})

/**
 * simple request service
 * GET and POST data to backend
 */


export class RequestService {

    constructor(private translate: TranslateService,  private http: HttpClient, private token: TokenService) {
    }


    /**
     * Returns selected language
     *
     */
    private getSelectedLanguage(): any {
        return (
            localStorage.getItem(LOCALIZATION_LOCAL_STORAGE_KEY) ||
            this.translate.getDefaultLang()
        );
    }


    /**
     *  Create POST request to backend and resturn result
     * @param url api url (wo domain)
     * @param data data
     * @returns request result
     */
    public async makePostRequest(url: string, data: any): Promise<any> {

        let current_language = this.getSelectedLanguage();
        data.language = current_language;

        let result = await this.http.post(environment.apiUrl + url, data,).toPromise();
        return result;
    }


}
