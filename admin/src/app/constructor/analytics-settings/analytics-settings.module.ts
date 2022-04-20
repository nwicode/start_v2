import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AnalyticsSettingsRoutingModule} from './analytics-settings-routing.module';
import {AnalyticsSettingsComponent} from './analytics-settings.component';
import {CommonExtensions} from '../../platform/LayoutsComponents/CommonExtensions.module';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {ToastService} from '../../platform/framework/core/services/toast.service';


@NgModule({
    providers: [
        MatSnackBar,
        MatSnackBarModule,
        ToastService,
    ],
    declarations: [AnalyticsSettingsComponent],
    imports: [
        CommonModule,
        CommonExtensions,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        MatTabsModule,
        MatSnackBarModule,
        AnalyticsSettingsRoutingModule
    ]
})
export class AnalyticsSettingsModule {
}
