import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';


import { TranslateModule } from '@ngx-translate/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ToastService } from '../../framework/core/services/toast.service';
import { MatTabsModule } from '@angular/material/tabs';
import { CKEditorModule } from 'ckeditor4-angular';
import { MailTemplatesComponent } from "./mail-templates.component";
import { MailTemplatesRoutingModule } from "./mail-templates-routing.module";
import { MailTemplatesEditorComponent } from './mail-templates-editor/mail-templates-editor.component';

@NgModule({
    providers: [
        MatSnackBar,
        MatSnackBarModule,
        ToastService
    ],
    declarations: [
        MailTemplatesComponent,
        MailTemplatesEditorComponent
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
        MailTemplatesRoutingModule,
        MatTabsModule,
        CKEditorModule
    ]
})
export class MailTemplatesModule { }
