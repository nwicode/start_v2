import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import {ToastService} from '../../framework/core/services/toast.service';
import { SubheaderService } from '../../LayoutsComponents/subheader/_services/subheader.service';
import { TranslationService } from '../../../services/translation.service';
import { SettingsService } from '../../../services/settings.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-settings-smtp',
  templateUrl: './settings-smtp.component.html',
  styleUrls: ['./settings-smtp.component.scss']
})
export class SettingsSmtpComponent implements OnInit {

  isLoading$: Observable<boolean>;
  formGroup: FormGroup;
  currentAppLanguage: string;

  smtp_host;
  smtp_port;
  smtp_user;
  smtp_password;

  constructor(private route: ActivatedRoute, private settingsService: SettingsService,
    private translationService: TranslationService, private subheader: SubheaderService,private toastService: ToastService, private fb: FormBuilder) { }

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
      this.settingsService.getSmtpSettings().then(response => {
        this.smtp_host = response.smtp_host;
        this.smtp_port = response.smtp_port;
        this.smtp_user = response.smtp_user;
        this.smtp_password = response.smtp_password;

        this.loadForm();
        observer.next(false);
      });
    });  
  }

  loadForm() {
    /*this.formGroup = this.fb.group({
      smtp_host: [this.smtp_host, Validators.compose([Validators.required,Validators.minLength(3),Validators.maxLength(320)])],
      smtp_port: [this.smtp_port, Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(320)])],
      smtp_user: [this.smtp_user, Validators.compose([Validators.required,Validators.minLength(3),Validators.maxLength(320)])],
      smtp_password: [this.smtp_password, Validators.compose([Validators.required,Validators.minLength(3),Validators.maxLength(320)])],
    });*/
    this.formGroup = this.fb.group({
      smtp_host: [this.smtp_host],
      smtp_port: [this.smtp_port],
      smtp_user: [this.smtp_user],
      smtp_password: [this.smtp_password],
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
    console.log(formValues);
    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      this.formGroup.disable();
      this.settingsService.saveSystemSmtp(formValues).then( res=> {
        this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_SAVED'), 'success');
        this.smtp_host = formValues.smtp_host;
        this.smtp_port = formValues.smtp_port;
        this.smtp_user = formValues.smtp_user;
        this.smtp_password = formValues.smtp_password;
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
      this.settingsService.getSmtpSettings().then(response => {
        this.smtp_host = response.smtp_host;
        this.smtp_port = response.smtp_port;
        this.smtp_user = response.smtp_user;
        this.smtp_password = response.smtp_password;

        this.loadForm();
        observer.next(false);
      });
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
