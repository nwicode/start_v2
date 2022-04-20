import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {FormBuilder, FormGroup} from "@angular/forms";
import {TranslationService} from "../../services/translation.service";
import {SubheaderService} from "../ConstructorComponents/subheader/_services/subheader.service";
import {ToastService} from "../../platform/framework/core/services/toast.service";
import {Router} from "@angular/router";
import {ApplicationService} from "../../services/application.service";

@Component({
  selector: 'app-one-signal-settings',
  templateUrl: './one-signal-settings.component.html',
  styleUrls: ['./one-signal-settings.component.scss']
})
export class OneSignalSettingsComponent implements OnInit {

  isLoading$: Observable<boolean>;
  formGroup: FormGroup;

  applicationId: number;

  one_signal_id: string;
  one_signal_enabled: boolean;
  one_signal_api_key: string;

  constructor(private translationService: TranslationService, private subheader: SubheaderService, private toastService: ToastService, private formBuilder: FormBuilder, private router: Router, private applicationService: ApplicationService) { }

  ngOnInit(): void {
    this.applicationId = Number(this.router.url.match(/constructor\/(\d+)/)[1]);

    setTimeout(() => {
      this.subheader.setTitle('CONSTRUCTOR.ONE_SIGNAL_SETTINGS.TITLE');
      this.subheader.setBreadcrumbs([{
        title: 'CONSTRUCTOR.ONE_SIGNAL_SETTINGS.TITLE',
        linkText: 'CONSTRUCTOR.ONE_SIGNAL_SETTINGS.TITLE',
        linkPath: '/constructor/' + this.applicationId + '/onesignal'
      }]);
    }, 1);

    this.isLoading$ = new Observable<boolean>( observer => {
      observer.next(true);

      this.applicationService.getOneSignalSettings(this.applicationId).then(result => {
        this.one_signal_id = result.one_signal_id;
        this.one_signal_enabled = result.one_signal_enabled;
        this.one_signal_api_key = result.one_signal_api_key;

        this.loadForm();
        observer.next(false);
      });
    });
  }

  loadForm() {
    this.formGroup = this.formBuilder.group({
      one_signal_id: [this.one_signal_id],
      one_signal_enabled: [this.one_signal_enabled],
      one_signal_api_key: [this.one_signal_api_key]
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

      this.applicationService.setOneSignalSettings(this.applicationId, formValues.one_signal_id, formValues.one_signal_enabled, formValues.one_signal_api_key).then(result => {
        if (result.is_error) {
          this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_NOT_SAVED'), 'danger');
        } else {
          this.one_signal_id = result.one_signal_id;
          this.one_signal_enabled = result.one_signal_enabled;
          this.one_signal_api_key = result.one_signal_api_key;

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

}
