import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {NgbDropdownModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {InlineSVGModule} from 'ng-inline-svg';
import {TranslateModule} from '@ngx-translate/core';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {ToastService} from "../../platform/framework/core/services/toast.service";
import {CommonExtensions} from "../../platform/LayoutsComponents/CommonExtensions.module";
import { LanguagesRoutingModule } from './languages-routing.module';
import { LanguagesComponent } from '../languages/languages.component';
import {MatCheckboxModule} from '@angular/material/checkbox';

@NgModule({
  providers: [
    MatSnackBar,
    MatSnackBarModule,
    ToastService
],    
  declarations: [LanguagesComponent],
  imports: [
    CommonModule,
    FormsModule,
    CommonExtensions,
    NgbDropdownModule,
    MatCheckboxModule,
    NgbTooltipModule,
    InlineSVGModule,
    TranslateModule,
    MatSnackBarModule,    
    LanguagesRoutingModule
  ]
})
export class LanguagesModule { }
