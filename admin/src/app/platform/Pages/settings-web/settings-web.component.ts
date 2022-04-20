import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import {ToastService} from '../../framework/core/services/toast.service';
import { SubheaderService } from '../../LayoutsComponents/subheader/_services/subheader.service';
import { TranslationService } from '../../../services/translation.service';
import { SettingsService } from '../../../services/settings.service';
import { ConfigService } from '../../../services/config.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-settings-web',
  templateUrl: './settings-web.component.html',
  styleUrls: ['./settings-web.component.scss']
})
export class SettingsWebComponent implements OnInit {

  isLoading$: Observable<boolean>;
  formGroup: FormGroup;
  currentAppLanguage: string;
  config: any = {};

  constructor(private route: ActivatedRoute, private configService: ConfigService, private settingsService: SettingsService,
    private translationService: TranslationService, private subheader: SubheaderService,private toastService: ToastService, private fb: FormBuilder,) { }

  ngOnInit(): void {
    this.currentAppLanguage = this.translationService.getSelectedLanguage();

    setTimeout(() => {
      this.subheader.setTitle('PAGE.SETTINGS_SYSTEM.TITLE');
      this.subheader.setBreadcrumbs([{
        title: 'PAGE.SETTINGS_SYSTEM.TITLE',
        linkText: 'PAGE.SETTINGS_SYSTEM.TITLE',
        linkPath: '/settings-meta'
      }]);
    }, 1);    
    
    this.isLoading$ = new Observable<boolean>( observer => {
      observer.next(true);
      this.configService.getConfig().then( data =>{
        this.config = data;
        this.loadForm();
        observer.next(false);      })

    });  
  }

  loadForm() {
    this.formGroup = this.fb.group({
      domain: [this.config.domain, Validators.compose([Validators.required,Validators.minLength(3),Validators.maxLength(320)])],
      email: [this.config.system_email, Validators.compose([Validators.required,Validators.email,Validators.minLength(3),Validators.maxLength(320)])],
      owner: [this.config.system_owner, Validators.compose([Validators.required,Validators.minLength(3),Validators.maxLength(320)])],
    });
  }

  canSave() {
    return false;
  }

  save() {
    this.formGroup.markAllAsTouched();
    if (!this.formGroup.valid) {
      return;
    }

    const formValues = this.formGroup.value;
    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      this.formGroup.disable();
      this.settingsService.saveGeneralSettings(formValues).then( res=> {
        this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_SAVED'), 'success');
      }).catch(err=>{
        this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_NOT_SAVED'), 'danger');
      }).finally(()=>{
        this.formGroup.enable();
        observer.next(false);
      });

    });
  }

  cancel() {
    this.isLoading$ = new Observable<boolean>( observer => {
      observer.next(true);
      
      this.loadForm();
      observer.next(false);
    });
  }

  // helpers for View
  isControlValid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }  

}
