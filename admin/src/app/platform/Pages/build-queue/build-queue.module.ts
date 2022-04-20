import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { NgbDropdownModule, NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {ToastService} from '../../framework/core/services/toast.service';
import {CommonExtensions} from '../../LayoutsComponents/CommonExtensions.module';
import { MatTabsModule } from '@angular/material/tabs';
import {InlineSVGModule} from 'ng-inline-svg';
import {BuildQueueRoutingModule} from "./build-queue-routing.module";
import {BuildQueueComponent} from "./build-queue.component";

@NgModule({
    providers: [
        MatSnackBar,
        MatSnackBarModule,
        ToastService,

    ],
    declarations: [
        BuildQueueComponent
    ],
    imports: [
        CommonModule,
        BuildQueueRoutingModule,
        CommonModule,
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
        MatSnackBarModule
    ]
})
export class BuildQueueModule { }
