import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {TranslateModule} from '@ngx-translate/core';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {ToastService} from '../../framework/core/services/toast.service';
import {CommonExtensions} from '../../LayoutsComponents/CommonExtensions.module';
import { MatTabsModule } from '@angular/material/tabs';

import { SettingsSmtpRoutingModule } from './settings-smtp-routing.module';
import {SettingsSmtpComponent } from './settings-smtp.component';

@NgModule({
  providers: [
    MatSnackBar,
    MatSnackBarModule,
    ToastService,
    
  ],   
  declarations: [SettingsSmtpComponent],
  imports: [
    CommonModule,
    SettingsSmtpRoutingModule,
    CommonExtensions,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MatTabsModule,
    MatSnackBarModule        
  ]
})
export class SettingsSmtpModule { }
