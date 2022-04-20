import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import {UserService} from '../../../../services/user.service';
import {TranslationService} from '../../../../services/translation.service';
import {ToastService} from '../../../framework/core/services/toast.service';
import { SubheaderService } from '../../../LayoutsComponents/subheader/_services/subheader.service';
import {LanguageValidator} from '../../../../validators/language.validator';

@Component({
  selector: 'app-add-language',
  templateUrl: './add-language.component.html',
  styleUrls: ['./add-language.component.scss']
})
export class AddLanguageComponent implements OnInit {

  isLoading$: Observable<boolean>;
  formGroup: FormGroup;
  flag_image: string;
  subscriptions: Subscription[] = [];

  constructor(private subheader: SubheaderService,private toastService: ToastService, private userService: UserService, private fb: FormBuilder, private translationService: TranslationService) { }

  ngOnInit(): void {

    setTimeout(() => {
      this.subheader.setTitle('PAGE.LANGUAGES.ADD_LANGUAGE');
      this.subheader.setBreadcrumbs([{
        title: 'PAGE.LANGUAGES.TITLE',
        linkText: 'PAGE.LANGUAGES.TITLE',
        linkPath: '/languages'
      }]);
    }, 1);    

    this.loadForm();

  }

  save() {
    this.formGroup.markAllAsTouched();
    const formValues = this.formGroup.value;
    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      console.log(formValues);
      this.translationService.addLanguage(formValues.name,formValues.code,formValues.flagfile).then ( result=>{
        console.log("addLanguage result:");
        if (result.is_error) {
          this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_NOT_SAVED'), 'danger');
        } else {
          this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_SAVED'), 'success');
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
        console.log(result);
        observer.next(false);
      });
      //observer.next(false);
    });    
  }

  cancel() {
    this.loadForm();

  }

  loadForm() {
    this.formGroup = this.fb.group({
      name: ['', Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.pattern('^[A-Za-z]+$'),
          Validators.maxLength(320)])],
      code: ['', Validators.compose([Validators.required, Validators.pattern('^[A-Za-z]+$'), Validators.minLength(2), Validators.maxLength(2)])],
      flagfile: ['', Validators.compose([Validators.required])],
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


  handleIconChange(file:any) {
    this.formGroup.controls['flagfile'].setValue(file);
    this.flag_image = file;
  }

  handleIconReset(ev:any) {
    this.formGroup.controls['flagfile'].setValue("");
    this.flag_image = "";
  }

}
