import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsRoutingModule } from './settings-routing.module';

import {TranslateModule} from '@ngx-translate/core';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {MatCommonModule} from '@angular/material/core';
import {ToastService} from '../../platform/framework/core/services/toast.service';
import {InlineSVGModule} from 'ng-inline-svg';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {CommonExtensions} from '../../platform/LayoutsComponents/CommonExtensions.module';
import { SettingsComponent } from './settings.component';
import { IconEditComponent } from './icon-edit/icon-edit.component';
import { SplashScreenEditComponent } from './splash-screen-edit/splash-screen-edit.component';
import { AppSettingsComponent } from './app-settings/app-settings.component';
import { PrivacyComponent } from './privacy/privacy.component';
import {CKEditorModule} from "ckeditor4-angular";

@NgModule({
  providers: [
    MatSnackBar,
    MatSnackBarModule,
    ToastService,
    MatCommonModule,
    InlineSVGModule,

  ],
  declarations: [
    SettingsComponent,
    IconEditComponent,
    SplashScreenEditComponent,
    AppSettingsComponent,
    PrivacyComponent
  ],
    imports: [
        CommonModule,
        SettingsRoutingModule,
        MatSnackBarModule,
        TranslateModule,
        InlineSVGModule,
        CommonExtensions,
        FormsModule,
        ReactiveFormsModule,
        CKEditorModule,
    ]
})
export class SettingsModule { }
