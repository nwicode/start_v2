import { Component, OnInit } from '@angular/core';
import {ContentService} from "../../../services/content.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {SubheaderService} from "../../ConstructorComponents/subheader/_services/subheader.service";
import {ToastService} from "../../../platform/framework/core/services/toast.service";
import {TranslationService} from "../../../services/translation.service";
import {ApplicationService} from "../../../services/application.service";

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements OnInit {

  isLoading$: Observable<boolean>;
  applicationId: number;
  currentLanguage: string;
  formGroup: FormGroup;

  isDefaultPrivacy = true;
  link = '';

  defaultPrivacyText = '';
  oldCustomPrivacyText = '';
  customPrivacyText = '';

  constructor(private applicationService: ApplicationService, private contentService: ContentService, private router: Router, private subheader: SubheaderService, private toastService: ToastService, private fb: FormBuilder, private translationService: TranslationService) { }

  ngOnInit(): void {

    this.applicationId = Number(this.router.url.match(/constructor\/(\d+)/)[1]);
    this.currentLanguage = this.translationService.getSelectedLanguage();

    setTimeout(() => {
      this.subheader.setTitle('CONSTRUCTOR.EDIT_PRIVACY.TITLE');
      this.subheader.setBreadcrumbs([{
        title: 'CONSTRUCTOR.SETTINGS.TITLE',
        linkText: 'CONSTRUCTOR.SETTINGS.TITLE',
        linkPath: '/constructor/' + this.applicationId + '/settings'
      }]);
    }, 1);

    this.isLoading$ = new Observable<boolean>( observer => {
      observer.next(true);

      Promise.all([this.applicationService.getApplicationById(this.applicationId), this.applicationService.getDefaultApplicationPrivacy(this.applicationId)])
          .then(response => {
            let application = response[0];
            this.isDefaultPrivacy = application.use_default_privacy;
            this.oldCustomPrivacyText = application.privacy_text;
            this.customPrivacyText = application.privacy_text;
            this.link = this.getBaseUrl() + 'privacy/' + application.unique_string_id;

            this.defaultPrivacyText = response[1].defaultPrivacy;

            this.loadForm();
            observer.next(false);
          })
    });

  }

  /**
   * Init formGroup.
   */
  loadForm() {
    this.formGroup = this.fb.group({
      defaultPrivacy: new FormControl(this.isDefaultPrivacy),
      link: new FormControl(this.link)
    });
  }

  /**
   * Save new splash screen.
   */
  save() {
    this.formGroup.markAllAsTouched();
    if (!this.formGroup.valid) {
      return;
    }

    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      this.formGroup.disable();

      this.applicationService.setApplicationPrivacy(this.applicationId, this.isDefaultPrivacy, this.customPrivacyText).then(response => {
        if (response.is_error) {
          this.toastService.showsToastBar(this.translationService.translatePhrase("GENERAL.LANGUAGES.CHANGES_NOT_SAVED"), 'danger');
        } else {
          this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_SAVED'), 'success');
          this.isDefaultPrivacy = response.use_default_privacy;
          this.customPrivacyText = response.privacy_text;
          this.oldCustomPrivacyText = response.privacy_text;
        }

        this.formGroup.enable();
        observer.next(false);
      });
    });
  }

  /**
   * Remove changes.
   */
  cancel() {
    this.customPrivacyText = this.oldCustomPrivacyText;
  }

  /**
   *  UseDefault checkbox change event.
   */
  useDefaultChange() {
    this.isDefaultPrivacy = this.formGroup.get('defaultPrivacy').value;
  }

  /**
   * Copy link value.
   */
  copyToClipBoard(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    this.toastService.showsToastBar(this.translationService.translatePhrase('CONSTRUCTOR.EDIT_PRIVACY.COPY_LINK'), 'success');
  }

  getBaseUrl() {
    let re = new RegExp(/\/\/([^\/]*\/)/);
    return re.exec(window.location.href)[1];
  }
}
