import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

class ClientConfig {
  google_web_client_id: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private configUrl = 'assets/settings/system_settings.json';

  constructor(private http: HttpClient) { }

  /**
   * read config file via httpclient
   * @returns config
   */
  async getConfig() {
    let config = await this.http.get(environment.apiUrl + this.configUrl).toPromise();
    return config;
  } 


  getClientConfig() {
    return this.http.get<ClientConfig>(environment.apiUrl + this.configUrl);
}  
}
