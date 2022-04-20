import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {TranslationService} from "../../../services/translation.service";
import {SubheaderService} from "../../ConstructorComponents/subheader/_services/subheader.service";
import {ToastService} from "../../../platform/framework/core/services/toast.service";
import {Router} from "@angular/router";
import {ApplicationService} from "../../../services/application.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'app-custom-font',
  templateUrl: './custom-font.component.html',
  styleUrls: ['./custom-font.component.scss']
})
export class CustomFontComponent implements OnInit {

  isLoading$: Observable<boolean>;

  formGroup: FormGroup;
  applicationId: number;
  inputText: any;

  constructor(private translationService: TranslationService, private subheader: SubheaderService, private toastService: ToastService, private router: Router, private applicationService: ApplicationService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.applicationId = Number(this.router.url.match(/constructor\/(\d+)/)[1]);

    setTimeout(() => {
      this.subheader.setTitle('CONSTRUCTOR.CUSTOM_FONT.TITLE');
      this.subheader.setBreadcrumbs([{
        title: 'CONSTRUCTOR.CUSTOM_FONT.TITLE',
        linkText: 'CONSTRUCTOR.CUSTOM_FONT.TITLE',
        linkPath: '/constructor/' + this.applicationId + '/fonts/custom-font'
      }]);
    }, 1);

    this.loadForm();
  }

  /**
   * Init form state.
   */
  loadForm() {
    this.formGroup = this.fb.group({
      fileInput: ['', Validators.required],
      fontFamilyName: ['', Validators.required],
    });

    this.inputText = '';
  }

  /**
   * Save font files.
   */
  save() {
    if (!this.formGroup.valid) {
      return;
    }

    let file = (<HTMLInputElement>document.getElementById('customFile')).files[0];
    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      this.formGroup.disable();
      this.applicationService.setApplicationCustomFont(String(this.applicationId), this.formGroup.controls['fontFamilyName'].value, file).then(response => {
        if (response.is_error) {
          this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_NOT_SAVED'), 'danger');
        } else {
          this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_SAVED'), 'success');
          //window.location.reload();
        }
        observer.next(false);
        this.formGroup.enable();
        this.loadForm();
      });
    });

  }

  /**
   * Refresh form state.
   */
  cancel() {
    this.loadForm();
  }

  /**
   * Input state change.
   */
  change() {
    this.inputText = (<HTMLInputElement>document.getElementById('customFile')).files[0].name;
  }
}
