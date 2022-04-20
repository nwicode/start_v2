import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import {UserService} from '../../../../services/user.service';
import {TranslationService} from '../../../../services/translation.service';
import {ToastService} from '../../../framework/core/services/toast.service';
import { SubheaderService } from '../../../LayoutsComponents/subheader/_services/subheader.service';


@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {

  user: any;
  subscriptions: Subscription[] = [];
  isLoading$: Observable<boolean>;
  languages: any[];
  formGroup: FormGroup;
  default_language: string;
  is_loaded:boolean = false;

  constructor(private subheader: SubheaderService,private toastService: ToastService, private userService: UserService, private fb: FormBuilder, private translationService: TranslationService) { }

  async ngOnInit() {

    setTimeout(() => {
      this.subheader.setTitle('PAGE.LANGUAGES.DEFAULT_LANGUAGE');
      this.subheader.setBreadcrumbs([{
        title: 'PAGE.LANGUAGES.TITLE',
        linkText: 'PAGE.LANGUAGES.TITLE',
        linkPath: '/languages'
      }]);
    }, 1);
    await this.translationService.readLanguages();
    this.languages = this.translationService.getAvailableLanguages();
    console.log("this.languages");
    console.log(this.languages);
    this.languages.forEach(l => {
      if (l.is_default==1) this.default_language = l.code;
    });
    this.loadForm();
    this.is_loaded = true;
  }

  loadForm() {
    this.formGroup = this.fb.group({
      defaultLanguage: [this.default_language, Validators.required]
    });
  }  

  save() {
    this.formGroup.markAllAsTouched();
    const formValues = this.formGroup.value;

    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      console.log(formValues.defaultLanguage);
      this.translationService.updateSystemDefaultLanguage(formValues.defaultLanguage).then ( result=>{
        console.log("updateSystemDefaultLanguage result:");
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
