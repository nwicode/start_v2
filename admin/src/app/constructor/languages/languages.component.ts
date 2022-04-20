import { Component, OnInit } from '@angular/core';
import { SubheaderService } from '../ConstructorComponents/subheader/_services/subheader.service';
import {Observable, Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {ApplicationService} from '../../services/application.service'
import { ActivatedRoute, Router } from '@angular/router';
import {TranslationService} from "../../services/translation.service";
import {ToastService} from '../../platform/framework/core/services/toast.service';

@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss']
})
export class LanguagesComponent implements OnInit {

  isLoading$: Observable<boolean>;
  app_id: number;
  languages_dulicates:string[] = [];
  languages:any[] = [];
  application:any = {};
  edit_array:any = {};
  was_changed:boolean = false;
  new_opened:boolean = false;

  code_validate:boolean = false;
  name_validate:boolean = false;
  default_validate:boolean = false;

  constructor(private translationService: TranslationService, private router: Router, private toastService: ToastService, private activateRoute: ActivatedRoute, private subheader: SubheaderService, private applicationService:ApplicationService) { }

  ngOnInit(): void {

    this.app_id = Number(this.router.url.match(/constructor\/(\d+)/)[1]);
    setTimeout(() => {
      this.subheader.setTitle('CONSTRUCTOR.LANGUAGES.TITLE');
    }, 1);    
  

    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      this.applicationService.getApplicationById(this.app_id).then(data=>{
        console.log("app");
        console.log(data);
        this.application = data;
        this.languages = data.languages;


        observer.next(false);
      }).finally( ()=>{
        //observer.next(false);
      });
    }); 

  }

  save() {
    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);

      this.applicationService.setApplicationLanguages(this.app_id,this.languages,this.application.default_language).then(data=>{

        //get new data
        this.application = data;
        this.languages = data.languages;

        observer.next(false);
        this.was_changed = false;
      }).finally( ()=>{
        //observer.next(false);
      });
    }); 
  }

  cancel() {
    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      this.applicationService.getApplicationById(this.app_id).then(data=>{
        console.log("app");
        console.log(data);
        this.application = data;
        this.languages = data.languages;


        observer.next(false);
        this.was_changed = false;
      }).finally( ()=>{
        //observer.next(false);
      });
    }); 
  }

  /**
   * open edit language form 
   * @param i - index in languages array
   */
  openLanguage(i:number) {
    this.languages.forEach(element => {
      element.edit = false;
    });
    this.languages[i].edit = true;
    this.edit_array = Object.assign({}, this.languages[i]);
    this.edit_array.is_active = false;
    this.edit_array.is_default = false;
    if (this.edit_array.active==1) this.edit_array.is_active = true;
    if (this.edit_array.code==this.application.default_language) this.edit_array.is_default = true;


  }


  /**
   * validate opened form
   * @param i - index in languages array
   */
  langFormValidate(i:number) {
    
    //check name - 
    let validate = true;

    if (this.edit_array.code.length!=2) {validate = false; this.code_validate = false;} else {this.code_validate = true}
    if (this.edit_array.name.length==0) {validate = false; this.name_validate = false;} else {this.name_validate = true}
    return validate;
  }

  /**
   * validate opened new lang form
   */
   newlangFormValidate() {
    
    //check name - 
    let validate = true;

    if (this.edit_array.code.length!=2) {validate = false; this.code_validate = false;} else {this.code_validate = true}
    if (this.edit_array.name.length==0) {validate = false; this.name_validate = false;} else {this.name_validate = true}
    return validate;
  }


  /**
   * Store cuurent edit lang to array
   * @param i store edit_lang to languages array
   */
  storelang(i:number) {
    if (this.edit_array.is_active) this.edit_array.active = 1; else this.edit_array.active = 0;
    this.edit_array.edit = false;
    this.languages[i] = this.edit_array;

    this.was_changed = true;
    if (this.edit_array.is_default) this.application.default_language = this.edit_array.code;
  }

  /**
   * Store new lang  to array
   * @param i store edit_lang to languages array
   */
  storenewlang() {
    if (this.edit_array.is_active) this.edit_array.active = 1; else this.edit_array.active = 0;
    this.edit_array.edit = false;

    this.languages.push(this.edit_array);
    this.was_changed = true;
    if (this.edit_array.is_default) this.application.default_language = this.edit_array.code;
    this.new_opened = false;
  }


  /**
   * remove color from array
   * @param i item index
   */
  removeLang(i:number) {

    if (this.languages.length>1) {
      this.languages.splice(i,1);
      this.was_changed = true;
    }

    //if langs array contains only one item, set it default and active
    if (this.languages.length==1) {
      this.languages[0].active = 1;
      this.application.default_language = this.languages[0].code;
    }
  }


  /**
   * Show add language form
   */
  showAddLangaugeForm() {
    this.new_opened = true;
    this.edit_array = {};
    this.edit_array.code = "";
    this.edit_array.name = "";
    this.edit_array.active = 1;
    this.edit_array.is_active = true;
    this.edit_array.is_default = false;
  }


  /**
   * return true, if default language not active
   */
   defaultIsActive() {
    let active: boolean = false;
    this.languages.forEach(element => {
      if (element.code==this.application.default_language && element.active==1) active = true;
    });
    return active;
  }
  /**
   * return true, if languages does not have active language
   */
  hasActive() {
    let hasActive: boolean = false;
    this.languages.forEach(element => {
      if (element.active==1) hasActive = true;
    });
    return hasActive;
  }

  /**
   * return true, if some language code has duplicates
   */
  doubleCode() {
    var codes = this.languages.map(function(item){ return item.code });
    this.languages_dulicates = this.findDuplicates(codes);
    if (this.languages_dulicates.length>0) return true; else return false;
  }

  /**
   * helper for found duplcates in arrays
   * @param arr array
   * @returns return arrays with duplicates values
   */
  findDuplicates(arr) {
    let sorted_arr = arr.slice().sort(); // You can define the comparing function here. 
    // JS by default uses a crappy string compare.
    // (we use slice to clone the array so the
    // original array won't be modified)
    let results = [];
    for (let i = 0; i < sorted_arr.length - 1; i++) {
      if (sorted_arr[i + 1] == sorted_arr[i]) {
        results.push(sorted_arr[i]);
      }
    }
    return results;
  }

}
