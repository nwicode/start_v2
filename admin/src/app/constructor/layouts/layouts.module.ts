import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LayoutsComponent} from '../layouts/layouts.component';
import {ListComponent} from '../layouts/list/list.component';
import { LayoutsRoutingModule } from './layouts-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {
  NgbDropdownModule,
  NgbProgressbarModule,
  NgbPopoverModule,
  NgbModule ,
} from '@ng-bootstrap/ng-bootstrap';
import {MatButtonModule} from '@angular/material/button';
import {TranslateModule} from '@ngx-translate/core';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {MatCommonModule} from '@angular/material/core';
import {ToastService} from '../../platform/framework/core/services/toast.service';
import { PageCardComponent } from './page-card/page-card.component';
import { SlidePanelComponent  } from './slide-panel/slide-panel.component';

import {InlineSVGModule} from 'ng-inline-svg';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';


import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTreeModule } from '@angular/material/tree';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  MatBottomSheetModule,
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {
  MatRippleModule,
  MatNativeDateModule,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconRegistry, MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { PageCreateFormComponent } from './page-create-form/page-create-form.component';
import { PageDeleteFormComponent } from './page-delete-form/page-delete-form.component';
import { PageSettingsFormComponent } from './page-settings-form/page-settings-form.component';
import {CommonExtensions} from '../../platform/LayoutsComponents/CommonExtensions.module';
import {MatRadioModule} from '@angular/material/radio';
import { ReactiveFormsModule } from '@angular/forms';
import { PageComponentFormComponent } from './page-component-form/page-component-form.component';
//import { ColorDialogComponent } from '../ConstructorComponents/color-dialog/color-dialog.component';

@NgModule({
  providers: [
    MatSnackBar,
    MatSnackBarModule,
    MatButtonModule,
    ToastService,
    MatCommonModule,
    InlineSVGModule,
    DragDropModule,
  ],
  declarations: [ListComponent, LayoutsComponent, PageCardComponent, SlidePanelComponent, PageCreateFormComponent, PageDeleteFormComponent, PageSettingsFormComponent, PageComponentFormComponent],
  imports: [
    CommonModule,
    LayoutsRoutingModule,
    TranslateModule,
    NgbDropdownModule,
    DragDropModule,
    NgbProgressbarModule, 
    NgbPopoverModule, 
    FormsModule ,     
    ReactiveFormsModule ,     
    CommonExtensions ,     
    NgbModule ,     
    MatButtonModule ,     
    MatRadioModule ,     
    MatCommonModule ,     
    MatSnackBarModule,
    InlineSVGModule,
    
    // material modules
    MatListModule,
    MatSliderModule,
    MatCardModule,
    MatSelectModule,
    MatIconModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatMenuModule,
    MatTabsModule,
    MatTooltipModule,
    MatSidenavModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTableModule,
    MatGridListModule,
    MatToolbarModule,
    MatBottomSheetModule,
    MatExpansionModule,
    MatDividerModule,
    MatSortModule,
    MatStepperModule,
    MatChipsModule,
    MatPaginatorModule,
    MatTreeModule,
    MatButtonToggleModule,
    MatDialogModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class LayoutsModule { }
