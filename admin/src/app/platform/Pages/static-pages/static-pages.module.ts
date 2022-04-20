import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';


import { TranslateModule } from '@ngx-translate/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ToastService } from '../../framework/core/services/toast.service';
import { StaticPagesComponent } from './static-pages.component';
import { StaticPagesRoutingModule } from './static-pages-routing.module';
import { StaticPageEditorComponent } from './static-page-editor/static-page-editor.component';
import { MatTabsModule } from '@angular/material/tabs';
import { CKEditorModule } from 'ckeditor4-angular';

@NgModule({
    providers: [
        MatSnackBar,
        MatSnackBarModule,
        ToastService
    ],
    declarations: [
        StaticPagesComponent,
        StaticPageEditorComponent
    ],
    imports: [
        CommonModule,
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        InlineSVGModule,
        TranslateModule,
        MatSnackBarModule,
        StaticPagesRoutingModule,
        MatTabsModule,
        CKEditorModule
    ]
})
export class StaticPagesModule { }
