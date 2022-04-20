import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {TranslateModule} from '@ngx-translate/core';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import {ToastService} from "../../platform/framework/core/services/toast.service";
import {CommonExtensions} from "../../platform/LayoutsComponents/CommonExtensions.module";
import { AdmobSettingsRoutingModule } from './admob-settings-routing.module';
import { AdmobSettingsComponent } from './admob-settings.component';


@NgModule({
    providers: [
        MatSnackBar,
        MatSnackBarModule,
        ToastService,

    ],
    declarations: [AdmobSettingsComponent],
    imports: [
        CommonModule,
        CommonExtensions,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        MatTabsModule,
        MatSnackBarModule,
        AdmobSettingsRoutingModule
    ]
})
export class AdmobSettingsModule { }
