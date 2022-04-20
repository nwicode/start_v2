import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateContentTypeRoutingModule } from './create-content-type-routing.module';

import {TranslateModule} from '@ngx-translate/core';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {MatCommonModule} from '@angular/material/core';
import {ToastService} from '../../platform/framework/core/services/toast.service';
import {InlineSVGModule} from 'ng-inline-svg';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {CommonExtensions} from '../../platform/LayoutsComponents/CommonExtensions.module';
import {MatTabsModule} from "@angular/material/tabs";
import {CreateContentTypeComponent} from "./create-content-type.component";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatInputModule} from "@angular/material/input";
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MatMomentDateModule} from '@angular/material-moment-adapter';
import {CKEditorModule} from "ckeditor4-angular";

@NgModule({
  providers: [
    MatSnackBar,
    MatSnackBarModule,
    ToastService,
    MatCommonModule,
    InlineSVGModule,
    {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}}
  ],
  declarations: [
      CreateContentTypeComponent
  ],
    imports: [
        CommonModule,
        CreateContentTypeRoutingModule,
        MatSnackBarModule,
        TranslateModule,
        InlineSVGModule,
        CommonExtensions,
        FormsModule,
        ReactiveFormsModule,
        MatTabsModule,
        MatExpansionModule,
        MatDatepickerModule,
        MatInputModule,
        MatMomentDateModule,
        CKEditorModule
    ]
})
export class CreateContentTypeModule { }
