import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {TranslationService} from "../../../services/translation.service";
import {ToastService} from "../../../platform/framework/core/services/toast.service";
import {EmojiValidator} from "../../../validators/emoji.validator";
import {SubheaderService} from '../../ConstructorComponents/subheader/_services/subheader.service';
import {ApplicationService} from "../../../services/application.service";
import {CheckboxesCheckedValidator} from "../../../validators/checkboxes-checked-validator";

@Component({
  selector: 'app-app-settings',
  templateUrl: './app-settings.component.html',
  styleUrls: ['./app-settings.component.scss']
})
export class AppSettingsComponent implements OnInit {

  isLoading$: Observable<boolean>;
  formGroup: FormGroup;

  applicationId: number;

  name: string;
  description: string;
  version: string;
  bundleId: string;
  android: boolean;
  ios: boolean;
  pwa: boolean;
  screenMode: string;

  constructor(private translationService: TranslationService, private subheader: SubheaderService, private toastService: ToastService, private formBuilder: FormBuilder, private router: Router, private applicationService: ApplicationService) { }

  ngOnInit(): void {
    this.applicationId = Number(this.router.url.match(/constructor\/(\d+)/)[1]);

    setTimeout(() => {
      this.subheader.setTitle('CONSTRUCTOR.APP_SETTINGS.TITLE');
      this.subheader.setBreadcrumbs([{
        title: 'CONSTRUCTOR.SETTINGS.TITLE',
        linkText: 'CONSTRUCTOR.SETTINGS.TITLE',
        linkPath: '/constructor/' + this.applicationId + '/settings'
      }]);
    }, 1);

    this.isLoading$ = new Observable<boolean>( observer => {
      observer.next(true);

      this.applicationService.getApplicationSettings(this.applicationId).then(result => {
        this.name = result.name;
        this.description = result.description;
        this.version = result.version;
        this.bundleId = result.bundleId;
        this.android = result.android;
        this.ios = result.ios;
        this.pwa = result.pwa;
        this.screenMode = result.screen_mode;

        this.loadForm();
        observer.next(false);
      });
    });
  }

  loadForm() {
    this.formGroup = this.formBuilder.group({
      name: [this.name, Validators.compose([Validators.required,Validators.minLength(6),Validators.maxLength(30), EmojiValidator.checkEmoji])],
      description: [this.description, Validators.required],
      version: [this.version, Validators.compose([Validators.required, Validators.pattern(/^[0-9]+.[0-9]+.[0-9]+$/)])],
      bundleId: [this.bundleId, Validators.compose([Validators.required, Validators.pattern(/^[0-9a-z]+\.[0-9a-z]+(\.[0-9a-z]+)*$/)])],
      platformsCheckboxes: this.formBuilder.group({
        android: [this.android],
        ios: [this.ios],
        pwa: [this.pwa]
      }, {validators: CheckboxesCheckedValidator.requireOneCheckboxToBeChecked}),
      screenMode: [this.screenMode, Validators.required]
    });

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

      this.applicationService.setApplicationSettings(this.applicationId, formValues.name, formValues.description, formValues.version,
          formValues.bundleId, formValues.platformsCheckboxes.android, formValues.platformsCheckboxes.ios, formValues.platformsCheckboxes.pwa, formValues.screenMode).then(result => {
        if (result.is_error) {
          this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_NOT_SAVED'), 'danger');
        } else {
          this.name = result.name;
          this.description = result.description;
          this.version = result.version;
          this.bundleId = result.bundle_id;
          this.android = result.android;
          this.ios = result.ios;
          this.pwa = result.pwa;
          this.screenMode = result.screen_mode;

          this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_SAVED'), 'success');
        }

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
