import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {SettingsSdkComponent} from './settings-sdk.component';

import {TranslateModule} from '@ngx-translate/core';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {ToastService} from '../../framework/core/services/toast.service';
import {CommonExtensions} from '../../LayoutsComponents/CommonExtensions.module';
import { MatTabsModule } from '@angular/material/tabs';
import {InlineSVGModule} from 'ng-inline-svg';
import { SettingsSdkRoutingModule } from './settings-sdk-routing.module';


@NgModule({
  providers: [
    MatSnackBar,
    MatSnackBarModule,
    ToastService,
  ],   
  declarations: [SettingsSdkComponent],
  imports: [
    CommonModule,
    InlineSVGModule,
    CommonExtensions,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MatTabsModule,
    MatSnackBarModule,   
    SettingsSdkRoutingModule
  ]
})
export class SettingsSdkModule { }
