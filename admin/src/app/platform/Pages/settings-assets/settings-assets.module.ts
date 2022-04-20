import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsAssetsRoutingModule } from './settings-assets-routing.module';
import { SettingsAssetsComponent } from './settings-assets.component';
import { SpinnerEditComponent } from './spinner-edit/spinner-edit.component';


import {NgbDropdownModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {InlineSVGModule} from 'ng-inline-svg';

import {TranslateModule} from '@ngx-translate/core';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {ToastService} from '../../framework/core/services/toast.service';
import { ImageCropperModule } from 'ngx-image-cropper';
import {CommonExtensions} from '../../LayoutsComponents/CommonExtensions.module';
import { InnerLogoEditComponent } from './inner-logo-edit/inner-logo-edit.component';
import { BgImageEditComponent } from './bg-image-edit/bg-image-edit.component';
import { AuthLogoEditComponent } from './auth-logo-edit/auth-logo-edit.component';
import {FaviconEditComponent} from "./favicon-edit/favicon-edit.component";


@NgModule({
  providers: [
    MatSnackBar,
    MatSnackBarModule,
    ToastService,
    
  ],

  declarations: [SettingsAssetsComponent, SpinnerEditComponent, InnerLogoEditComponent, BgImageEditComponent, AuthLogoEditComponent, FaviconEditComponent],
  imports: [
    CommonModule,
    SettingsAssetsRoutingModule,
    ImageCropperModule,
    CommonModule,
    CommonExtensions,
    NgbDropdownModule,
    NgbTooltipModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    TranslateModule,
    MatSnackBarModule    
  ]
})
export class SettingsAssetsModule { }
