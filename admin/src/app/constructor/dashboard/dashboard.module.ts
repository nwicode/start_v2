import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {DashboardRoutingModule} from './dashboard-routing.module';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {ToastService} from '../../platform/framework/core/services/toast.service';
import {DashboardComponent} from './dashboard.component';
import {CommonExtensions} from '../../platform/LayoutsComponents/CommonExtensions.module';
import {NgbDropdownModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {InlineSVGModule} from 'ng-inline-svg';
import {NgApexchartsModule} from 'ng-apexcharts';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
    providers: [
        MatSnackBar,
        MatSnackBarModule,
        NgApexchartsModule,
        ToastService,
    ],

    declarations: [
        DashboardComponent,
    ],

    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CommonExtensions,
        NgbDropdownModule,
        NgbTooltipModule,
        DashboardRoutingModule,
        TranslateModule,
        InlineSVGModule,
        NgApexchartsModule,
        MatSnackBarModule,
    ]
})
export class DashboardModule {
}
