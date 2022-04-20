import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationTranslationsComponent } from './application-translations.component';
import { ApplicationTranslationsRoutingModule } from './application-translations-routing.module';


import { FormsModule } from '@angular/forms';
import {NgbDropdownModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {InlineSVGModule} from 'ng-inline-svg';
import {TranslateModule} from '@ngx-translate/core';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {ToastService} from "../../platform/framework/core/services/toast.service";
import {CommonExtensions} from "../../platform/LayoutsComponents/CommonExtensions.module";
import {MatCheckboxModule} from '@angular/material/checkbox';


@NgModule({
  providers: [
    MatSnackBar,
    MatSnackBarModule,
    ToastService
],      
  declarations: [ApplicationTranslationsComponent],
  imports: [
    CommonModule,
    ApplicationTranslationsRoutingModule,
    CommonModule,
    FormsModule,
    CommonExtensions,
    NgbDropdownModule,
    MatCheckboxModule,
    NgbTooltipModule,
    InlineSVGModule,
    TranslateModule,
    MatSnackBarModule,      
  ]
})
export class ApplicationTranslationsModule { }
