import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {TranslateModule} from '@ngx-translate/core';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import {ToastService} from "../../platform/framework/core/services/toast.service";
import {CommonExtensions} from "../../platform/LayoutsComponents/CommonExtensions.module";
import { ContentRoutingModule } from './content-routing.module';
import {ContentComponent} from "./content.component";
import {ContentListComponent} from "./content-list/content-list.component";
import {InlineSVGModule} from "ng-inline-svg";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { ContentEditComponent } from './content-edit/content-edit.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatInputModule} from "@angular/material/input";
import {MatNativeDateModule} from "@angular/material/core";
import {MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from "@angular/material-moment-adapter";
import {CKEditorModule} from "ckeditor4-angular";
import {CoreModule} from "../../platform/framework/core";


@NgModule({
    providers: [
        MatSnackBar,
        MatSnackBarModule,
        ToastService,
        {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}}
    ],
    declarations: [
        ContentComponent,
        ContentListComponent,
        ContentEditComponent
    ],
    imports: [
        CommonModule,
        CommonExtensions,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        MatTabsModule,
        MatSnackBarModule,
        ContentRoutingModule,
        InlineSVGModule,
        NgbModule,
        MatDatepickerModule,
        MatInputModule,
        MatMomentDateModule,
        CKEditorModule,
        CoreModule
    ]
})
export class ContentModule { }
