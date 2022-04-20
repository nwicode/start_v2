import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {InlineSVGModule} from 'ng-inline-svg';


import {TranslateModule} from '@ngx-translate/core';
import {CommonExtensions} from '../../LayoutsComponents/CommonExtensions.module';
import {ActivityLogRoutingModule} from "./activity-log-routing.module";
import {ActivityLogComponent} from "./activity-log.component";



@NgModule({
    providers: [
    ],
    declarations: [
        ActivityLogComponent
    ],
    imports: [
        CommonModule,
        CommonExtensions,
        InlineSVGModule,
        TranslateModule,
        ActivityLogRoutingModule,
        NgbModule,
    ]
})
export class ActivityLogModule { }
