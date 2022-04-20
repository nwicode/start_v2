import {ConstantPool} from '@angular/compiler';
import {Injectable} from '@angular/core';
import {RequestService} from './request.service';
import {TokenService} from './token.service';
import {Observable, Subject} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import { AsyncValidatorFn } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
/**
 * Methods and properties for User
 */
export class UserService {

  private subject = new Subject<any>();
  private editUserSubject = new Subject<any>();
  private changeEditUserManagersSubject = new Subject<any>();
  private userOpenPreview = new Subject<any>();
  private countries: any[];

  constructor(private request:RequestService , private token: TokenService, private route: ActivatedRoute,private router: Router,) { }

  /**
   * Check, current user logined or not.
   * @returns true if user login or false if not
   */
  public is_logined() {
    return this.token.isValid();    
  }


  /**
   * Authorize user by login and password
   * @param login user login
   * @param password user password
   * @returns auth result or false if unsuccess
   */

  public async do_login(login:string, password:string) {

    let result:any;
    try {
      //console.log("do_login then data:");
      let data =  await this.request.makePostRequest("api/login",{email:login,password:password});
      //console.log(data);
      data.is_error = false;
      result = data;

      //store token

      this.token.handle(data.access_token);

    } catch (error) {
      //console.log("do login error");
      error.is_error = true;
      result = error;
    }
    return result;

  }

  /**
   * Remove login token
   */
  public do_signout() {
    this.token.remove();
    document.location.reload();
    
  }

  public async mail_confirm(user) {
    let result:any;
    try {
      console.log("do_signup then data:");
      let data =  await this.request.makePostRequest("api/mailconfirm",user);
      console.log(data);
      data.is_error = false;
      result = data;
    } catch (error) {
      console.log("do_signup error");
      error.is_error = true;
      result = error;
    }
    return result;    
  }

  /**
   * Authorize user from google.
   *
   * @param email user email
   * @param name user full name
   * @param idToken token identifier
   */
  public async googleLogin(email: string, name: string, idToken: string) {
    let result: any;

    try {
      let data =  await this.request.makePostRequest("api/googleLogin", {
        email: email,
        name: name,
        idToken: idToken
      });
      this.token.handle(data.access_token);
      data.is_error = false;
      result = data;
    } catch (error) {
      error.is_error = true;
      result = error;
    }
    return result;
  }


  /**
   * Try to reset user password (by email) and sent email with new password to user
   * @param email  - user email
   * @returns operation result message
   */
  public async password_reset(email:string) {
    let result:any;
    try {
      console.log("password_reset then data:");
      let data =  await this.request.makePostRequest("api/reset",{email:email});
      console.log(data);
      data.is_error = false;
      result = data;
    } catch (error) {
      console.log("password_reset error");
      error.is_error = true;
      result = error;
    }
    return result; 
  }


  /**
   * check user login on core and update last activity
   * @returns operation result
   */
  public async check_me() {
    let result:any;
    try {
      //console.log("check_me then data:");
      let data =  await this.request.makePostRequest("api/me",{});
      console.log(data);
      data.is_error = false;
      result = data;
    } catch (error) {
      //console.log("check_me error");
      error.is_error = true;
      result = error;
    }    
    return result;
  }



  /**
   * get curent user data
   * @returns operation result
   */
   public async current() {
    let result:any;
    try {
      console.log("get curent data:");
      let data =  await this.request.makePostRequest("api/current",{});
      console.log(data);
      data.is_error = false;
      result = data;
      this.subject.next({ result });
    } catch (error) {
      console.log("get curent data");
      error.is_error = true;
      result = error;
    }    
    return result;
  }

  onUserUpate(): Observable<any> {
      return this.subject.asObservable();
  }

  /**
   * Store current user personal information
   * @param name user name
   * @param lastname user lastname
   * @param phone user phone
   * @param country user country
   * @param address user address
   * @param company user company
   * @param avatar user avatar in base64
   * @returns response
   */
  async savePersonalInformation(name: string, lastname: string, phone: string, country: string, address: string, company: string, avatar: string) {
    let result: any;
    try {
      let data = await this.request.makePostRequest("api/savePersonalInformation", {
        name,
        lastname,
        phone,
        country,
        address,
        company,
        avatar
      });

      data.is_error = false;
      result = data;
      this.subject.next({ result });
    } catch (error) {
      console.log("savePersonalInformation error");
      error.is_error = true;
      result = error;
    }

    return result;
  }


  async checkEmail(email: string) {
    let result: any;
    try {
      let data = await this.request.makePostRequest("api/checkEmail", {
        email,
      });

      data.is_error = false;
      result = data;
    } catch (error) {
      console.log("checkEmail error");
      error.is_error = true;
      result = error;
    }

    return result;    
  }

  /**
   * Create user
   * @param form user form
   * @param avatar user avatr base64
   * @returns 
   */
  async addCustomer(form:any,avatar: string) {
    let result: any;
    try {
      let data = await this.request.makePostRequest("api/addCustomer", {
        form,
        avatar
      });

      data.is_error = false;
      result = data;
    } catch (error) {
      console.log("addCustomer error");
      error.is_error = true;
      result = error;
    }

    return result;    
  }


  /**
   * Store current user account information.
   *
   * @param email user email
   * @param defaultLanguage user default language
   */
  async saveAccountInformation(email: string, defaultLanguage: string) {
    let result: any;
    try {
      let data = await this.request.makePostRequest("api/saveAccountInformation", {
        email,
        defaultLanguage
      });

      data.is_error = false;
      result = data;
      this.subject.next({ result });
    }  catch (error) {
      console.log("saveAccountInformation error");
      error.is_error = true;
      result = error;
    }

    return result;
  }

  /**
   * Block user account.
   *
   * @param id user id
   */
  async blockAccount(id?: string|number) {
    let result: any;
    try {
      const data = await this.request.makePostRequest("api/blockAccount", {id: id});

      data.is_error = false;
      result = data;
    }  catch (error) {
      error.is_error = true;
      result = error;
    }

    return result;
  }


  /**
   * Change current user password.
   *
   * @param oldPassword
   * @param newPassword
   */
  async changePassword(oldPassword: string, newPassword: string) {
    let result: any;
    try {
      let data = await this.request.makePostRequest("api/changePassword", {
        oldPassword,
        newPassword
      });

      data.is_error = false;
      result = data;
    }  catch (error) {
      console.log("changePassword error");
      error.is_error = true;
      result = error;
    }

    return result;
  }

  /**
   * Download country list.
   */
  public downloadCountries() {
    this.request.makePostRequest("api/getCountries", {}).then(response => {
      const data = Object.entries(response);
      this.countries = [];
      data.forEach(([key, value]) => {
        this.countries.push(value);
      });
    });
  }

  /**
   * Return country list.
   */
  public getCountries() {
     return this.countries;
  }


  /**
   * get user list for SU
   * @param limit rows per page
   * @param start start position,
   * @param sort sort field
   * @param order sort order
   * @param filter filter string
   */
  public async getUserList(limit:number = 25, start:number = 0, sort:string = "", order:string = "", filter:string = "") {
    let result: any;
    try {
      let data = await this.request.makePostRequest("api/getUsers", {
        limit:limit,
        start:start,
        sort:sort,
        order:order,
        filter:filter,
      });

      data.is_error = false;
      result = data;
    }  catch (error) {
      console.log("getUserList error");
      error.is_error = true;
      result = error;
    }

    return result;
  }

  /**
   * Get information about user with certain id.
   *
   * @param user_id user id
   */
  async getUserInformationById(user_id) {
    let result: any;
    try {
      let data = await this.request.makePostRequest("api/getUserById", { id: user_id });

      data.is_error = false;
      result = data;

      this.editUserSubject.next({ result });
    }  catch (error) {
      error.is_error = true;
      result = error;
    }

    return result;
  }

  /**
   * Store personal information user with certain id.
   *
   * @param id user id
   * @param name user name
   * @param lastname user last name
   * @param phone user phone
   * @param country user country
   * @param address user address
   * @param company user company
   * @param avatar user avatar in base64
   * @returns response
   */
  async editUserPersonalInformation(id: string|number, name: string, lastname: string, phone: string, country: string, address: string, company: string, avatar: string) {
    let result: any;
    try {
      let data = await this.request.makePostRequest("api/editUserPersonalInformation", {
        id,
        name,
        lastname,
        phone,
        country,
        address,
        company,
        avatar
      });

      data.is_error = false;
      result = data;

      this.editUserSubject.next({ result });
    } catch (error) {
      error.is_error = true;
      result = error;
    }

    return result;
  }

  /**
   * Store account information user with certain id.
   *
   * @param id user id
   * @param email user email
   * @param defaultLanguage user default language
   */
  async editUserAccountInformation(id: string|number, email: string, defaultLanguage: string, role: string|number = 0) {
    let result: any;
    try {
      let data = await this.request.makePostRequest("api/editUserAccountInformation", {
        id,
        email,
        defaultLanguage,
        role
      });

      data.is_error = false;
      result = data;

      this.editUserSubject.next({ result });
    }  catch (error) {
      error.is_error = true;
      result = error;
    }

    return result;
  }

  /**
   * Change password user with certain id.
   *
   * @param id user id
   * @param newPassword user new password
   */
  async editUserPassword(id: string|number, newPassword: string) {
    let result: any;
    try {
      let data = await this.request.makePostRequest("api/editUserPassword", {
        id,
        newPassword
      });

      data.is_error = false;
      result = data;
    }  catch (error) {
      error.is_error = true;
      result = error;
    }

    return result;
  }

  /**
   * On user found by id updated.
   */
  onEditUserUpdate(): Observable<any> {
    return this.editUserSubject.asObservable();
  }


  /**
   * Event on user click show preview button
   * @returns Observable
   */
  onOpenPreview(): Observable<any> {
    return this.userOpenPreview.asObservable();
  }

  /**
   * Emmit user preview 
   */
  openPreview(v:boolean = true) {
    this.userOpenPreview.next(v);
  }

  /**
   * Change user tariff.
   *
   * @param userId user id
   * @param newTarifId new tariff id
   * @param tarifPeriod new tarif duration
   */
  public async changeUserTarif(userId, newTarifId, tarifPeriod) {
    let result: any;
    try {
      let data = await this.request.makePostRequest("api/changeUserTarif", {
        userId: userId,
        newTarifId: newTarifId,
        tarifPeriod: tarifPeriod
      });

      data.is_error = false;
      result = data;
    } catch (error) {
      error.is_error = true;
      result = error;
    }

    return result;
  }

  /**
   * Get managers associated with the user.
   *
   * @param userId user id
   */
  public async getUserManagers(userId: number|string) {
    let result: any;
    try {
      let data = await this.request.makePostRequest("api/getUserManagers", {
        userId: userId
      });

      data.is_error = false;
      result = data;
    } catch (error) {
      error.is_error = true;
      result = error;
    }

    return result;
  }

  /**
   * Create new manager user.
   *
   * @param parentId manager's owner id
   * @param managerAvatar manager avatar
   * @param managerName manager name
   * @param managerLastname manager lastname
   * @param managerEmail manager email
   * @param managerPassword manager password
   * @param associatedApplications applications with which the manager is associated
   */
  public async createManager(parentId: number|string, managerAvatar: string, managerName: string, managerLastname: string, managerEmail: string, managerPassword: string, associatedApplications: any[]) {
    let result: any;

    try {
      let data = await this.request.makePostRequest("api/createManager", {
        parentId: parentId,
        managerAvatar: managerAvatar,
        managerName: managerName,
        managerLastname: managerLastname,
        managerEmail: managerEmail,
        managerPassword: managerPassword,
        associatedApplications: associatedApplications
      });

      this.changeEditUserManagersSubject.next(data);

      data.is_error = false;
      result = data;

    } catch (error) {
      error.is_error = true;
      result = error;
    }

    return result;
  }


  /**
   * Edit manager.
   *
   * @param parentId manager's owner id
   * @param managerId manager id
   * @param managerAvatar manager avatar
   * @param managerName manager name
   * @param managerLastname manager lastname
   * @param managerEmail manager email
   * @param managerPassword manager password
   * @param associatedApplications
   */
  public async editManager(parentId: number|string, managerId: number|string, managerAvatar: string, managerName: string, managerLastname: string, managerEmail: string, managerPassword: string, associatedApplications: any[]) {
    let result: any;

    try {
      let data = await this.request.makePostRequest("api/editManager", {
        parentId: parentId,
        managerId: managerId,
        managerAvatar: managerAvatar,
        managerName: managerName,
        managerLastname: managerLastname,
        managerEmail: managerEmail,
        managerPassword: managerPassword,
        associatedApplications: associatedApplications
      });

      data.is_error = false;
      result = data;
    } catch (error) {
      error.is_error = true;
      result = error;
    }

    return result;
  }

  /**
   * Delete manager.
   *
   * @param managerId manager id
   */
  public async deleteManager(managerId: number|string) {
    let result: any;

    try {
      let data = await this.request.makePostRequest("api/deleteManager", { managerId: managerId });

      data.is_error = false;
      result = data;

      this.changeEditUserManagersSubject.next();
    } catch (error) {
      error.is_error = true;
      result = error;
    }

    return result;
  }

  /**
   * On manager deleted.
   */
  onChangeEditUserManagers(): Observable<any> {
    return this.changeEditUserManagersSubject.asObservable();
  }

  /**
   * Get manager information.
   *
   * @param managerId manager id
   */
  public async getManager(managerId?: number|string) {
    let result: any;

    try {
      let data = await this.request.makePostRequest("api/getManager", {managerId: managerId});

      data.is_error = false;
      result = data;

    } catch (error) {
      error.is_error = true;
      result = error;
    }

    return result;
  }
}
