import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbDropdownModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {InlineSVGModule} from 'ng-inline-svg';

import {TranslateModule} from '@ngx-translate/core';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {ToastService} from '../../framework/core/services/toast.service';
import {CommonExtensions} from '../../LayoutsComponents/CommonExtensions.module';
import {CreateAppComponent} from './create-app.component';
import {CreateAppRoutingModule} from "./create-app-routing.module";



@NgModule({
    providers: [
        MatSnackBar,
        MatSnackBarModule,
        ToastService,

    ],
    declarations: [
        CreateAppComponent
    ],
    imports: [
        CommonModule,
        CommonExtensions,
        NgbDropdownModule,
        NgbTooltipModule,
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        InlineSVGModule,
        TranslateModule,
        MatSnackBarModule,
        CreateAppRoutingModule
    ]
})
export class CreateAppModule { }
