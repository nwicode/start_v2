import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import {UserService} from '../../../../services/user.service';
import {TranslationService} from '../../../../services/translation.service';
import {ToastService} from '../../../framework/core/services/toast.service';
import { SubheaderService } from '../../../LayoutsComponents/subheader/_services/subheader.service';

@Component({
  selector: 'app-upload-language',
  templateUrl: './upload-language.component.html',
  styleUrls: ['./upload-language.component.scss']
})
export class UploadLanguageComponent implements OnInit {

  isLoading$: Observable<boolean>;
  formGroup: FormGroup;
  inputText = '';

  constructor(private subheader: SubheaderService,private toastService: ToastService, private userService: UserService, private fb: FormBuilder, private translationService: TranslationService) { }

  ngOnInit(): void {
    this.loadForm();

    setTimeout(() => {
      this.subheader.setTitle('PAGE.LANGUAGES.UPLOAD_LANGUAGE');
      this.subheader.setBreadcrumbs([{
        title: 'PAGE.LANGUAGES.TITLE',
        linkText: 'PAGE.LANGUAGES.TITLE',
        linkPath: '/languages'
      }]);
    }, 1);    
  }

  /**
   * Init form state
   */
  loadForm() {
    this.formGroup = this.fb.group({
      fileInput: ['', Validators.required]
    });

    this.inputText = '';
  }

  /**
   * Add new language pack
   */
  save() {
    if (!this.formGroup.valid) {
        return;
    }

    console.log((<HTMLInputElement>document.getElementById('customFile')).files[0].name);
    console.log(this.formGroup.controls['fileInput']);
    let file = (<HTMLInputElement>document.getElementById('customFile')).files[0];
    this.isLoading$ = new Observable<boolean>(observer => {
        observer.next(true);
        this.formGroup.disable();
        this.translationService.downloadLanguagePack(file).then(response => {
          console.log("response");
          console.log(response);
            observer.next(false);
            this.formGroup.enable();
            if (response.is_error) {
              this.toastService.showsToastBar(this.translationService.translatePhrase('PAGE.LANGUAGES.LANGUAGE_PUCK_PROBLEM'), 'danger');
              //this.toastService.showsToastBar(response.message, 'danger');
            } else {
              this.toastService.showsToastBar(this.translationService.translatePhrase('PAGE.LANGUAGES.LANGUAGE_PUCK_ADDED'), 'success');
              window.location.reload();
            }
        }).catch( err=>{
          console.log("Upload language file error:");
          console.log(err);
          this.toastService.showsToastBar(err.message, 'danger');
        })
    });
  }

  /**
   * Refresh form state
   */
  cancel() {
    this.loadForm();
  }

  /**
   * Check input state change
   */
  change() {
    this.inputText = (<HTMLInputElement>document.getElementById('customFile')).files[0].name;
  }
}
