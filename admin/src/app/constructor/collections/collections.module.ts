import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { NgbDropdownModule, NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {ToastService} from '../../platform/framework/core/services/toast.service';
import {CommonExtensions} from '../../platform/LayoutsComponents/CommonExtensions.module';
import { MatTabsModule } from '@angular/material/tabs';
import {InlineSVGModule} from 'ng-inline-svg';
import { CollectionsRoutingModule } from './collections-routing.module';
import { CKEditorModule } from 'ckeditor4-angular';
import { CollectionsListComponent } from './collections-list/collections-list.component';
import { EditCollectionComponent } from './edit-collection/edit-collection.component';
import {CollectionsComponent} from "./collections.component";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import { RecordsListComponent } from './records-list/records-list.component';
import { EditRecordComponent } from './edit-record/edit-record.component';


@NgModule({
  providers: [
    MatSnackBar,
    MatSnackBarModule,
    ToastService,
    
  ],   
  declarations: [CollectionsComponent, CollectionsListComponent, EditCollectionComponent, RecordsListComponent, EditRecordComponent],
  imports: [
    CommonModule,
    CollectionsRoutingModule,
    InlineSVGModule,
    CommonExtensions,
    HttpClientModule,
    NgbModule,
    NgbTooltipModule,
    FormsModule,
    NgbDropdownModule,
    ReactiveFormsModule,
    TranslateModule,
    MatTabsModule,
    MatSnackBarModule,
    CKEditorModule,
    MatExpansionModule,
    MatInputModule,
    MatDatepickerModule
  ]
})
export class CollectionsModule { }
