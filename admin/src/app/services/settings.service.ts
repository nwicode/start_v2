import { ConstantPool } from '@angular/compiler';
import { Injectable } from '@angular/core';
import {RequestService} from './request.service';
import {TokenService} from './token.service';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  


  constructor(private request:RequestService , private token: TokenService, private route: ActivatedRoute,private router: Router,) { }


  /**
   * Store system settings to core
   * @param settings fields system_email, system_owner, domain
   * @returns response
   */
  async saveGeneralSettings(settings: any) {
    let result: any;
    try {
      let data = await this.request.makePostRequest("api/saveSystemGeneral", { settings: settings});
      data.is_error = false;
      result = data;
    }  catch (error) {
      console.log("saveGeneralSettings error");
      error.is_error = true;
      result = error;
    }
    return result;
  }

  /**
   * Store system settings to core
   * @param settings fields smtp_host, smtp_port, smtp_user, smtp_password
   * @returns response
   */
  async saveSystemSmtp(settings: any) {
    let result: any;
    try {
      let data = await this.request.makePostRequest("api/saveSystemSmtp", { settings: settings});
      data.is_error = false;
      result = data;
    }  catch (error) {
      console.log("saveSystemSmtp error");
      error.is_error = true;
      result = error;
    }
    return result;
  }


  /**
   * store brand image to server
   * @param field field name
   * @param file file in base64
   * @param field2 field2 name (optional)
   * @param color color (optional)
   * @returns 
   */
  async saveBrandImage(field:string, file:string, field2:string = "", color:string = "", field3:string = "", color2:string = "") {
    let result: any;
    try {
      let data = await this.request.makePostRequest("api/saveBrandImage", { field: field, image:file, field2: field2, color:color, field3: field3, color2:color2 });
      data.is_error = false;
      result = data;
    }  catch (error) {
      console.log("saveBrandImage error");
      error.is_error = true;
      result = error;
    }
    return result;
  }

  /**
   * Store field trial_day in system settings to core.
   *
   * @param trial_day field trial_day
   * @returns response
   */
  async saveTrialDay(trial_day: any) {
    let result: any;
    try {
      let data = await this.request.makePostRequest("api/saveTrialDay", { trial_day: trial_day});
      data.is_error = false;
      result = data;
    }  catch (error) {
      console.log("saveTarifTrial error");
      error.is_error = true;
      result = error;
    }
    return result;
  }

  /**
   * Store field users_registration_enabled in system settings to core.
   *
   * @param registration_enabled field users_registration_enabled
   * @param google_registration field google_registration
   * @param google_web_client_id field google_web_client_id
   */
  async saveUsersRegistrationPossibility(registration_enabled: boolean, google_registration:boolean, google_web_client_id:string) {
    let result: any;
    try {
      let data = await this.request.makePostRequest("api/saveUsersRegistrationPossibility", { 
        users_registration_enabled: registration_enabled,
        google_registration: google_registration,
        google_web_client_id: google_web_client_id,
        
      });
      data.is_error = false;
      result = data;
    }  catch (error) {
      console.log("saveUsersRegistrationPossibility error");
      error.is_error = true;
      result = error;
    }
    return result;
  }



  /**
   * Load admin dashboard
   * 
   */
   async getAdminDashboard() {
    let result: any;
    try {
      result = await this.request.makePostRequest('api/getAdminDashboard', {});
    } catch (error) {
      error.is_error = true;
      result = error;
    }

    return result;
  }

  /**
   * Get stripe settings
   */
   async getStripeSettings() {
    let result: any;
    try {
      result = await this.request.makePostRequest('api/get_stripe_settings', {});
    } catch (error) {
      error.is_error = true;
      result = error;
    }
    return result;
  }


  /**
   * Store stripe settings on core
   * @param secret_key stripe secret key
   * @param public_key stripe public key
   * @param webhook_key stripe webhook secret
   * @param tarif_data stripe price ids
   * @returns 
   */
  async setStripeSettings(secret_key:string, public_key:string, webhook_key:string, tarif_data:any) {
    let result: any;
    try {
      let data = await this.request.makePostRequest("api/set_stripe_settings", { secret_key: secret_key, public_key:public_key, webhook_key:webhook_key, tarif_data:tarif_data});
      data.is_error = false;
      result = data;
    }  catch (error) {
      console.log("setStripeSettings error");
      error.is_error = true;
      result = error;
    }
    return result;
  }

  /**
   * Load smtp settings.
   */
  async getSmtpSettings() {
    let result: any;
    try {
      let data = await this.request.makePostRequest("api/getSmtpSettings", { });
      data.is_error = false;
      result = data;
    }  catch (error) {
      console.log("getSmtpSettings error");
      error.is_error = true;
      result = error;
    }
    return result;
  }

  /**
   * Set new favicon.
   */
  async setFavicon(favicon) {
    let result: any;
    try {
      let data = await this.request.makePostRequest("api/setFavicon", { favicon: favicon });
      data.is_error = false;
      result = data;
    }  catch (error) {
      console.log("setFavicon error");
      error.is_error = true;
      result = error;
    }
    return result;
  }

  /**
   * Get favicon.
   */
  async getFavicon() {
    let result: any;
    try {
      let data = await this.request.makePostRequest("api/getFavicon", {  });
      data.is_error = false;
      result = data;
    }  catch (error) {
      console.log("getFavicon error");
      error.is_error = true;
      result = error;
    }
    return result;
  }

}
