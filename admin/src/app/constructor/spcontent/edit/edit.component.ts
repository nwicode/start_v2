import { Component, OnInit } from '@angular/core';
import { SubheaderService } from '../../ConstructorComponents/subheader/_services/subheader.service';
import {Observable, Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {ApplicationService} from '../../../services/application.service'
import { ActivatedRoute, Router } from '@angular/router';
import {TranslationService} from "../../../services/translation.service";
import {ToastService} from '../../../platform/framework/core/services/toast.service';
import {IAP, IAP_language} from "../../../interfaces/iap";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  
  
  isLoading$: Observable<boolean>;
  app_id: number;
  product_iap_id:number = 0;
  product:IAP;
  iap_languages:IAP_language[] = [];
  was_loaded:boolean = false;
  application:any;
  formGroup: FormGroup;

  constructor(private fb: FormBuilder, private route: ActivatedRoute,private translationService: TranslationService, private router: Router, private toastService: ToastService, private activateRoute: ActivatedRoute, private subheader: SubheaderService, private applicationService:ApplicationService) { }

  ngOnInit(): void {


    
    this.app_id = Number(this.router.url.match(/constructor\/(\d+)/)[1]);


    this.route.params.subscribe(val => {
      console.log("get product_iap_id:");
      console.log(this.route.snapshot.paramMap.get('product_iap_id'));
      this.product_iap_id = parseInt(this.route.snapshot.paramMap.get('product_iap_id'));
    });

    setTimeout(() => {
      if (this.product_iap_id==0) this.subheader.setTitle('CONSTRUCTOR.SPCONTENT.ADD_PRODUCT'); else this.subheader.setTitle('CONSTRUCTOR.SPCONTENT.EDIT_PRODUCT');
      this.subheader.setBreadcrumbs([{
        title: 'CONSTRUCTOR.SPCONTENT.TITLE',
        linkText: 'CONSTRUCTOR.SPCONTENT.TITLE',
        linkPath: '/constructor/'+this.app_id.toString()+"/spcontent/"
      }]);      
    }, 1);  

    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      this.applicationService.getApplicationById(this.app_id).then(data=>{
        console.log("app");
        console.log(data);
        this.application = data;
        
        this.loadForm();
        this.was_loaded = true;

        observer.next(false);
      }).finally( ()=>{
        //observer.next(false);
      });
    });
    
  }


  /**
   * fill form
   */
  loadForm() {


    //By default  - empty
    this.product = {
      code: "",
      id:0,
      iap_id:0,
      name: "",
      description: "",
      disabled: true,
      type: "",
      languages: this.iap_languages
    }

    this.application.languages.forEach( (l) => {
      let iap_lang_item: IAP_language = {
        code:l.code,
        description: "",
        language_name: l.name,
        name: ""
      };
      this.iap_languages.push(iap_lang_item);
    });



    if (this.product_iap_id!=0) {
      this.application.in_app_products.forEach(iap => {

        if (iap.id == this.product_iap_id) {

          console.log("iap");
          console.log(iap);
          console.log(this.product_iap_id);

          this.product.id = iap.id;
          this.product.code = iap.code;
          this.product.name = iap.name;
          this.product.description = iap.description;
          if (iap.disabled==1) this.product.disabled = true; else this.product.disabled = false;
          this.product.type = iap.type;
          this.product.iap_id = iap.iap_id;

          //replace languages
          this.product.languages = [];
          this.application.languages.forEach(app_lang => {

            let language_found: boolean = false;

            //scasn and add to iap lamguage array exists items
            iap.languages_array.forEach(iap_lang => {
              if (app_lang.code==iap_lang.lang) {
                language_found = true;
                this.product.languages.push({
                  code: iap_lang.lang,
                  description: iap_lang.description,
                  language_name: app_lang.name,
                  name:iap_lang.name
                })
              }

            });


              //if lang not found, insert empty data
              if (!language_found) {
                this.product.languages.push({
                  code: app_lang.code,
                  description: "",
                  language_name: app_lang.name,
                  name:""
                })
              }            

          });

        }
      });
    }


    console.log(this.product);

  }

  save() {
    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      this.applicationService.setApplicationIAP(this.app_id, this.product).then(response=>{
       
        if (response.is_error) {
          this.toastService.showsToastBar(this.translationService.translatePhrase("GENERAL.LANGUAGES.CHANGES_NOT_SAVED"), 'danger');
        } else {
          this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_SAVED'), 'success');
          this.router.navigate(['/constructor',this.app_id,'spcontent','list']);
        }

        observer.next(false);
      }).finally( ()=>{
        //observer.next(false);
      });
    });
  }




  /**
   * validate product form
   * @returns validate product fields, true or false
   */
  validate() {
    let result: boolean = true;

    // check all fields
    if (this.product) {
      if (this.product.iap_id==0) result = false;
      else if (this.product.code=="") result = false;
      this.product.languages.forEach(el => {
        if (el.name=="") result = false;
        else if (el.description=="") result = false;
      });
    } else result = false;

    return result;
  }

}
