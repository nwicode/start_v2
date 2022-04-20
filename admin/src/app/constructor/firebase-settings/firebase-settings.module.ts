import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {TranslateModule} from '@ngx-translate/core';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import {ToastService} from "../../platform/framework/core/services/toast.service";
import {CommonExtensions} from "../../platform/LayoutsComponents/CommonExtensions.module";
import { FirebaseSettingsRoutingModule } from './firebase-settings-routing.module';
import {FirebaseSettingsComponent} from "./firebase-settings.component";


@NgModule({
    providers: [
        MatSnackBar,
        MatSnackBarModule,
        ToastService,
    ],
    declarations: [FirebaseSettingsComponent],
    imports: [
        CommonModule,
        CommonExtensions,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        MatTabsModule,
        MatSnackBarModule,
        FirebaseSettingsRoutingModule
    ]
})
export class FirebaseSettingsModule { }
