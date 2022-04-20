import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {FormBuilder, FormGroup} from "@angular/forms";
import {TranslationService} from "../../services/translation.service";
import {SubheaderService} from "../ConstructorComponents/subheader/_services/subheader.service";
import {ToastService} from "../../platform/framework/core/services/toast.service";
import {Router} from "@angular/router";
import {ApplicationService} from "../../services/application.service";

@Component({
  selector: 'app-mix-panel-settings',
  templateUrl: './mix-panel-settings.component.html',
  styleUrls: ['./mix-panel-settings.component.scss']
})
export class MixPanelSettingsComponent implements OnInit {

  isLoading$: Observable<boolean>;
  formGroup: FormGroup;

  applicationId: number;

  mixpanel_token: string;
  mixpanel_enabled: boolean;

  constructor(private translationService: TranslationService, private subheader: SubheaderService, private toastService: ToastService, private formBuilder: FormBuilder, private router: Router, private applicationService: ApplicationService) { }

  ngOnInit(): void {
    this.applicationId = Number(this.router.url.match(/constructor\/(\d+)/)[1]);

    setTimeout(() => {
      this.subheader.setTitle('CONSTRUCTOR.MIX_PANEL_SETTINGS.TITLE');
      this.subheader.setBreadcrumbs([{
        title: 'CONSTRUCTOR.MIX_PANEL_SETTINGS.TITLE',
        linkText: 'CONSTRUCTOR.MIX_PANEL_SETTINGS.TITLE',
        linkPath: '/constructor/' + this.applicationId + '/mixpanel'
      }]);
    }, 1);

    this.isLoading$ = new Observable<boolean>( observer => {
      observer.next(true);

      this.applicationService.getMixPanelSettings(this.applicationId).then(result => {
        this.mixpanel_token = result.mixpanel_token;
        this.mixpanel_enabled = result.mixpanel_enabled;

        this.initForm();
        observer.next(false);
      });
    });
  }

  initForm() {
    this.formGroup = this.formBuilder.group({
      mixpanel_token: [this.mixpanel_token],
      mixpanel_enabled: [this.mixpanel_enabled]
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

      this.applicationService.setMixPanelSettings(this.applicationId, formValues.mixpanel_token, formValues.mixpanel_enabled).then(result => {
        if (result.is_error) {
          this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_NOT_SAVED'), 'danger');
        } else {
          this.mixpanel_token = result.mixpanel_token;
          this.mixpanel_enabled = result.mixpanel_enabled;

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

      this.initForm();
      observer.next(false);
    });
  }

}
