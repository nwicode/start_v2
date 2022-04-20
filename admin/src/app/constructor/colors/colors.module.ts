import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorsRoutingModule } from './colors-routing.module';
import { NgbDropdownModule, NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ColorsComponent } from '../colors/colors.component';
import { MainColorsComponent } from './main-colors/main-colors.component';

import {TranslateModule} from '@ngx-translate/core';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {MatCommonModule} from '@angular/material/core';
import {ToastService} from '../../platform/framework/core/services/toast.service';
import {InlineSVGModule} from 'ng-inline-svg';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import {CommonExtensions} from '../../platform/LayoutsComponents/CommonExtensions.module';
import { SystemColorComponent } from './system-color/system-color.component';
import { UserColorComponent } from './user-color/user-color.component';
import { AdditionalColorComponent } from './additional-color/additional-color.component';
import { AndroidMockupComponent } from '../ConstructorComponents/android-mockup/android-mockup.component';
@NgModule({
  providers: [
    MatSnackBar,
    MatSnackBarModule,
    ToastService,
    MatCommonModule,
    InlineSVGModule,

  ],
  declarations: [ColorsComponent, MainColorsComponent, SystemColorComponent, UserColorComponent, AdditionalColorComponent,AndroidMockupComponent],
  imports: [
    CommonModule,
    ColorsRoutingModule,
    MatSnackBarModule,
    TranslateModule,
    InlineSVGModule,
    CommonExtensions,
    NgbDropdownModule,
    NgbTooltipModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,


  ]
})
export class ColorsModule { }
