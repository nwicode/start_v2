import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {TranslationService} from "../../services/translation.service";
import {ToastService} from "../../platform/framework/core/services/toast.service";
import {SubheaderService} from '../ConstructorComponents/subheader/_services/subheader.service';
import {ApplicationService} from "../../services/application.service";

@Component({
  selector: 'app-app-settings',
  templateUrl: './admob-settings.component.html',
  styleUrls: ['./admob-settings.component.scss']
})
export class AdmobSettingsComponent implements OnInit {

  isLoading$: Observable<boolean>;
  formGroup: FormGroup;

  applicationId: number;

  bannerId: string;
  interstitialId: string;
  rewardVideo: string;
  enableAdMob: boolean;

  constructor(private translationService: TranslationService, private subheader: SubheaderService, private toastService: ToastService, private formBuilder: FormBuilder, private router: Router, private applicationService: ApplicationService) { }

  ngOnInit(): void {
    this.applicationId = Number(this.router.url.match(/constructor\/(\d+)/)[1]);

    setTimeout(() => {
      this.subheader.setTitle('CONSTRUCTOR.ADMOB_SETTINGS.TITLE');
      this.subheader.setBreadcrumbs([{
        title: 'CONSTRUCTOR.ADMOB_SETTINGS.TITLE',
        linkText: 'CONSTRUCTOR.ADMOB_SETTINGS.TITLE',
        linkPath: '/constructor/' + this.applicationId + '/admob-settings'
      }]);
    }, 1);

    this.isLoading$ = new Observable<boolean>( observer => {
      observer.next(true);

      this.applicationService.getAdMobSettings(this.applicationId).then(result => {
        this.bannerId = result.adMobBannerId;
        this.interstitialId = result.adMobInterstitialId;
        this.rewardVideo = result.rewardVideoAd;
        this.enableAdMob = result.adMobEnabled;

        this.loadForm();
        observer.next(false);
      });
    });
  }

  loadForm() {
    this.formGroup = this.formBuilder.group({
      bannerId: [this.bannerId],
      interstitialId: [this.interstitialId],
      rewardVideo: [this.rewardVideo],
      enableAdMob: [this.enableAdMob]
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

      this.applicationService.setAdMobSettings(this.applicationId, formValues.bannerId, formValues.interstitialId, formValues.rewardVideo, formValues.enableAdMob).then(result => {
        if (result.is_error) {
          this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_NOT_SAVED'), 'danger');
        } else {
          this.bannerId = result.adMobBannerId;
          this.interstitialId = result.adMobInterstitialId;
          this.rewardVideo = result.rewardVideoAd;
          this.enableAdMob = result.adMobEnabled;

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
