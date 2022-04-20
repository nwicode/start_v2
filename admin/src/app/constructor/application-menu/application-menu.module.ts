import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationMenuComponent } from './application-menu.component';
import { ApplicationMenuRoutingModule } from './application-menu-routing.module';



import { FormsModule } from '@angular/forms';
import {NgbDropdownModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {InlineSVGModule} from 'ng-inline-svg';
import {TranslateModule} from '@ngx-translate/core';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {ToastService} from "../../platform/framework/core/services/toast.service";
import {CommonExtensions} from "../../platform/LayoutsComponents/CommonExtensions.module";
import {MatCheckboxModule} from '@angular/material/checkbox';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
//import {GalleryDialogModule} from '../../../modules/gallery-dialog/gallery-dialog.module';
import {GalleryDialogModule} from '../ConstructorComponents/gallery-dialog/gallery-dialog.module';

@NgModule({
  providers: [
    MatSnackBar,
    MatSnackBarModule,
    ToastService
],    
  declarations: [ApplicationMenuComponent],
  imports: [
    CommonModule,
    ApplicationMenuRoutingModule,
    CommonModule,
    FormsModule,
    DragDropModule,
    CommonExtensions,
    NgbDropdownModule,
    MatCheckboxModule,
    NgbTooltipModule,
    MatSelectModule,
    InlineSVGModule,
    TranslateModule,
    MatSnackBarModule,    
    MatFormFieldModule,    
    MatInputModule,
    GalleryDialogModule,
 
  ]
})
export class ApplicationMenuModule { }
