import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {TranslateModule} from '@ngx-translate/core';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {ToastService} from '../../framework/core/services/toast.service';
import {CommonExtensions} from '../../LayoutsComponents/CommonExtensions.module';
import { MatTabsModule } from '@angular/material/tabs';

import { SettingsWebRoutingModule } from './settings-web-routing.module';
import {SettingsWebComponent } from './settings-web.component';

@NgModule({
  providers: [
    MatSnackBar,
    MatSnackBarModule,
    ToastService,
    
  ],   
  declarations: [SettingsWebComponent],
  imports: [
    CommonModule,
    SettingsWebRoutingModule,
    CommonExtensions,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MatTabsModule,
    MatSnackBarModule        
  ]
})
export class SettingsWebModule { }
