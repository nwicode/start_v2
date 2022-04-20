import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageCropperModule } from 'ngx-image-cropper';

import { NgbDropdownModule, NgbTooltipModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { LanguagesRoutingModule } from './languages-routing.module';
import { LanguagesComponent } from './languages.component';
import {TranslateModule} from '@ngx-translate/core';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {ToastService} from '../../framework/core/services/toast.service';
import { DefaultComponent } from './default/default.component';
import { AddLanguageComponent } from './add-language/add-language.component';
import { UploadLanguageComponent } from './upload-language/upload-language.component';
//import { ImageUploaderComponent } from '../../LayoutsComponents/image-uploader/image-uploader.component';
import {CommonExtensions} from '../../LayoutsComponents/CommonExtensions.module';
import { ManageComponent } from './manage/manage.component';

@NgModule({
  providers: [
    MatSnackBar,
    MatSnackBarModule,
    ToastService
  ],  
  declarations: [LanguagesComponent, DefaultComponent, AddLanguageComponent, UploadLanguageComponent, ManageComponent, ManageComponent],
  imports: [
    CommonModule,
    CommonExtensions,
    NgbDropdownModule,
    NgbTooltipModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    TranslateModule,
    ImageCropperModule,
    MatSnackBarModule,
    LanguagesRoutingModule
  ]
})
export class LanguagesModule { }
