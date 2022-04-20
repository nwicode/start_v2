import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule, NgbTooltipModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {ToastService} from '../../framework/core/services/toast.service';
import {CommonExtensions} from '../../LayoutsComponents/CommonExtensions.module';
import { CurrencyComponent } from './currency.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {TranslateModule} from '@ngx-translate/core';
import { CurrencyRoutingModule } from './currency-routing.module';


@NgModule({
  providers: [
    MatSnackBar,
    MatSnackBarModule,
    ToastService
  ],  
  declarations: [CurrencyComponent],
  imports: [
    CommonModule,
    TranslateModule,
    CurrencyRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
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
    MatSnackBarModule
  ]
})
export class CurrencyModule { }
