import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FontsComponent} from "./fonts.component";
import {FontsRoutingModule} from "./fonts-routing.module";
import {CommonExtensions} from "../../platform/LayoutsComponents/CommonExtensions.module";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {ToastService} from "../../platform/framework/core/services/toast.service";
import {MatRadioModule} from "@angular/material/radio";
import { CustomFontComponent } from './custom-font/custom-font.component';



@NgModule({
  providers: [
    MatSnackBar,
    MatSnackBarModule,
    ToastService,
  ],
  declarations: [FontsComponent, CustomFontComponent],
  imports: [
    CommonModule,
    CommonExtensions,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MatSnackBarModule,
    FontsRoutingModule,
    MatRadioModule
  ]
})
export class FontsModule { }
