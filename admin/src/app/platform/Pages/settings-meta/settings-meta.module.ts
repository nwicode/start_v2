import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { SettingsMetaRoutingModule } from './settings-meta-routing.module';
import {SettingsMetaComponent} from './settings-meta.component';

import {TranslateModule} from '@ngx-translate/core';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {ToastService} from '../../framework/core/services/toast.service';
import {CommonExtensions} from '../../LayoutsComponents/CommonExtensions.module';
import { MatTabsModule } from '@angular/material/tabs';


@NgModule({
  providers: [
    MatSnackBar,
    MatSnackBarModule,
    ToastService,
    
  ],  
  declarations: [SettingsMetaComponent],
  imports: [
    CommonModule,
    CommonModule,
    CommonExtensions,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    SettingsMetaRoutingModule,
    MatTabsModule,
    MatSnackBarModule    
  ]
})
export class SettingsMetaModule { }
