import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SPContentRoutingModule } from './spcontent-routing.module';
import {NgbDropdownModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {InlineSVGModule} from 'ng-inline-svg';
import {TranslateModule} from '@ngx-translate/core';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {ToastService} from "../../platform/framework/core/services/toast.service";
import {CommonExtensions} from "../../platform/LayoutsComponents/CommonExtensions.module";
import {SPContentComponent} from './spcontent.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  providers: [
    MatSnackBar,
    MatSnackBarModule,
    ToastService
],  
  declarations: [SPContentComponent, ListComponent, EditComponent],
  imports: [
    CommonModule,
    CommonExtensions,
    FormsModule,
    MatTabsModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    NgbTooltipModule,
    InlineSVGModule,
    TranslateModule,
    MatSnackBarModule, 
    SPContentRoutingModule
  ]
})
export class SPContentModule { }
