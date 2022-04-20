import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import {UserService} from '../../../services/user.service';
import { RequestService } from '../../../services/request.service';
import {ToastService} from '../../framework/core/services/toast.service';
import { SubheaderService } from '../../LayoutsComponents/subheader/_services/subheader.service';
import { CurrencyService } from './currency.service';
import {TranslationService} from '../../../services/translation.service';


@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss']
})
export class CurrencyComponent implements OnInit {

  user: any;
  my_id:any;
  subscriptions: Subscription[] = [];
  isLoading$: Observable<boolean>;
  currencies: any[];
  formGroup: FormGroup;
  default_currency: string;

  constructor(private CurrencyService: CurrencyService, private translationService: TranslationService, private ref: ChangeDetectorRef, private request:RequestService,private subheader: SubheaderService,private toastService: ToastService, private userService: UserService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loadForm();
    this.getCurrencies();
    setTimeout(() => {
      this.subheader.setTitle('PAGE.CURRENCY.DEFAULT_CURRENCY');
      this.subheader.setBreadcrumbs([{
        title: 'PAGE.CURRENCY.TITLE',
        linkText: 'PAGE.CURRENCY.TITLE',
        linkPath: '/currency'
      }]);
    }, 1);
  }
  
  public async getCurrencies() {
    let user = await this.userService.check_me();
    let result:any;
    this.my_id = user.id
    try {
      let data =  await this.request.makePostRequest('api/getcurrencies',{id:this.my_id});
      this.currencies = data;
    } catch (error) {
      console.log("error: ", error)
    } 
    this.ref.detectChanges();
    return result;
  }
  
  public async getDefaultCurrency() {
    let result:any;
    try {
      let data =  await this.request.makePostRequest('api/getdefaultcurrency',{});
      this.default_currency = data;
      result = data;
      this.formGroup.controls['defaultCurrency'].setValue(this.default_currency, {onlySelf: true});
    } catch (error) {
      console.log("error: ", error)
    } 
    this.ref.detectChanges();
    return result;
  }

  loadForm() {
    this.getDefaultCurrency();
    this.formGroup = this.fb.group({
      defaultCurrency: [this.default_currency, Validators.required]
    });
  }  

  save() {
    this.formGroup.markAllAsTouched();
    const formValues = this.formGroup.value;
    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      console.log(formValues.defaultCurrency);
      this.CurrencyService.updateSystemDefaultCurrency(formValues.defaultCurrency).then ( result=>{
        console.log("updateSystemDefaultCurrency result:");
        if (result.is_error) {
          this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_NOT_SAVED'), 'danger');
        } else {
          this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_SAVED'), 'success');
        }
        console.log(result);
        observer.next(false);
      });
      
    });

  }

  cancel() {
    this.loadForm();
  }

}
