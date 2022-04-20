import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentTypeListRoutingModule } from './content-type-list-routing.module';

import {TranslateModule} from '@ngx-translate/core';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {MatCommonModule} from '@angular/material/core';
import {ToastService} from '../../platform/framework/core/services/toast.service';
import {InlineSVGModule} from 'ng-inline-svg';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {CommonExtensions} from '../../platform/LayoutsComponents/CommonExtensions.module';
import {MatTabsModule} from "@angular/material/tabs";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {ContentTypeListComponent} from "./content-type-list.component";

@NgModule({
  providers: [
    MatSnackBar,
    MatSnackBarModule,
    ToastService,
    MatCommonModule,
    InlineSVGModule,
  ],
  declarations: [
      ContentTypeListComponent
  ],
    imports: [
        CommonModule,
        ContentTypeListRoutingModule,
        MatSnackBarModule,
        TranslateModule,
        InlineSVGModule,
        CommonExtensions,
        FormsModule,
        ReactiveFormsModule,
        MatTabsModule,
        MatExpansionModule,
        MatDatepickerModule
    ]
})
export class ContentTypeListModule { }
