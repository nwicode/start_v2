import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {FormBuilder, FormGroup} from '@angular/forms';
import {TranslationService} from '../../services/translation.service';
import {SubheaderService} from '../ConstructorComponents/subheader/_services/subheader.service';
import {ToastService} from '../../platform/framework/core/services/toast.service';
import {Router} from '@angular/router';
import {ApplicationService} from '../../services/application.service';

@Component({
    selector: 'app-analytics-settings',
    templateUrl: './analytics-settings.component.html',
    styleUrls: ['./analytics-settings.component.scss']
})
export class AnalyticsSettingsComponent implements OnInit {
    isLoading$: Observable<boolean>;
    formGroup: FormGroup;
    applicationId: number;
    googleAnalyticsViewID: string;

    constructor(private translationService: TranslationService, private subheader: SubheaderService, private toastService: ToastService,
                private formBuilder: FormBuilder, private router: Router, private applicationService: ApplicationService) {
    }

    ngOnInit(): void {
        this.applicationId = Number(this.router.url.match(/constructor\/(\d+)/)[1]);

        setTimeout(() => {
            this.subheader.setTitle('CONSTRUCTOR.GOOGLE_ANALYTICS_SETTINGS.TITLE');
            this.subheader.setBreadcrumbs([{
                title: 'CONSTRUCTOR.GOOGLE_ANALYTICS_SETTINGS.TITLE',
                linkText: 'CONSTRUCTOR.GOOGLE_ANALYTICS_SETTINGS.TITLE',
                linkPath: '/constructor/' + this.applicationId + '/analytics-settings'
            }]);
        }, 1);

        this.isLoading$ = new Observable<boolean>(observer => {
            observer.next(true);
            this.applicationService.getAnalyticsSettings(this.applicationId).then(result => {
                this.googleAnalyticsViewID = result.google_analytics_view_id;
                this.initForm();
                observer.next(false);
            });
        });
    }

    initForm() {
        this.formGroup = this.formBuilder.group({
            google_analytics_view_id: [this.googleAnalyticsViewID],
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
            this.applicationService.setAnalyticsSettings(this.applicationId, formValues.google_analytics_view_id)
                .then(result => {
                    if (result.is_error) {
                        this.toastService.showsToastBar(this.translationService
                            .translatePhrase('GENERAL.LANGUAGES.CHANGES_NOT_SAVED'), 'danger');
                    } else {
                        this.googleAnalyticsViewID = result.mixpanel_token;
                        this.toastService.showsToastBar(this.translationService
                            .translatePhrase('GENERAL.LANGUAGES.CHANGES_SAVED'), 'success');
                    }
                    this.formGroup.enable();
                    observer.next(false);
                });
        });
    }

    cancel() {
        this.isLoading$ = new Observable<boolean>(observer => {
            observer.next(true);

            this.initForm();
            observer.next(false);
        });
    }

}
