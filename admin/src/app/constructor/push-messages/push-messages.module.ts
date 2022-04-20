import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {TranslateModule} from '@ngx-translate/core';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTabsModule} from '@angular/material/tabs';
import {ToastService} from "../../platform/framework/core/services/toast.service";
import {CommonExtensions} from "../../platform/LayoutsComponents/CommonExtensions.module";
import {PushMessagesRoutingModule} from './push-messages-routing.module';
import {PushMessagesComponent} from './push-messages.component';
import {InlineSVGModule} from "ng-inline-svg";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {PushMessageService} from "../../services/push-message.service";
import {MatInputModule} from "@angular/material/input";
import {MatRadioModule} from "@angular/material/radio";
import { TopicsComponent } from './topics/topics.component';


@NgModule({
    providers: [
        MatSnackBar,
        MatSnackBarModule,
        ToastService,
        PushMessageService
    ],
    declarations: [PushMessagesComponent, TopicsComponent],
    imports: [
        CommonModule,
        CommonExtensions,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        MatTabsModule,
        MatSnackBarModule,
        PushMessagesRoutingModule,
        InlineSVGModule,
        NgbModule,
        MatInputModule,
        MatRadioModule
    ]
})
export class PushMessagesModule { }
