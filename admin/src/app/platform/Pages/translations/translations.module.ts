import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageCropperModule } from 'ngx-image-cropper';

import { NgbDropdownModule, NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { TranslateModule } from '@ngx-translate/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ToastService } from '../../framework/core/services/toast.service';
import { CommonExtensions } from '../../LayoutsComponents/CommonExtensions.module';
import { TranslationsComponent } from './translations.component';
import { TranslationsRoutingModule } from "./translations-routing.module";
import { EditTranslationsComponent } from "./edit-translations/edit-translations.component";

@NgModule({
    providers: [
        MatSnackBar,
        MatSnackBarModule,
        ToastService
    ],
    declarations: [
        TranslationsComponent,
        EditTranslationsComponent
    ],
    imports: [
        CommonModule,
        CommonExtensions,
        NgbDropdownModule,
        NgbTooltipModule,
        NgbModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        InlineSVGModule,
        TranslateModule,
        ImageCropperModule,
        MatSnackBarModule,
        TranslationsRoutingModule
    ]
})
export class TranslationsModule { }
