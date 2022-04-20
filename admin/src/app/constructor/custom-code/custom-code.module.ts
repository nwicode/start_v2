import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomCodeRoutingModule } from './custom-code-routing.module';

import {TranslateModule} from '@ngx-translate/core';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {MatCommonModule} from '@angular/material/core';
import {ToastService} from '../../platform/framework/core/services/toast.service';
import {InlineSVGModule} from 'ng-inline-svg';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {CommonExtensions} from '../../platform/LayoutsComponents/CommonExtensions.module';
import {CustomCodeComponent} from "./custom-code.component";
import { CustomCodeEditorComponent } from './custom-code-editor/custom-code-editor.component';
import {MatTabsModule} from "@angular/material/tabs";

@NgModule({
  providers: [
    MatSnackBar,
    MatSnackBarModule,
    ToastService,
    MatCommonModule,
    InlineSVGModule,

  ],
  declarations: [
      CustomCodeComponent,
      CustomCodeEditorComponent
  ],
    imports: [
        CommonModule,
        CustomCodeRoutingModule,
        MatSnackBarModule,
        TranslateModule,
        InlineSVGModule,
        CommonExtensions,
        FormsModule,
        ReactiveFormsModule,
        MatTabsModule
    ]
})
export class CustomCodeModule { }
