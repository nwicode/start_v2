import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {InlineSVGModule} from 'ng-inline-svg';
import {TranslateModule} from '@ngx-translate/core';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import {ToastService} from "../../platform/framework/core/services/toast.service";
import {CommonExtensions} from "../../platform/LayoutsComponents/CommonExtensions.module";

import { BuildRoutingModule } from './build-routing.module';
import {BuildComponent} from './build.component';

@NgModule({
  providers: [
    MatSnackBar,
    MatSnackBarModule,
    ToastService,

],  
  declarations: [BuildComponent],
  imports: [
    CommonModule,
    CommonExtensions,
    HttpClientModule,
    FormsModule,
    InlineSVGModule,
    ReactiveFormsModule,
    TranslateModule,
    MatTabsModule,
    MatSnackBarModule,    
    BuildRoutingModule
  ]
})
export class BuildModule { }
