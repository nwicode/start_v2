import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InlineSVGModule} from 'ng-inline-svg';
import {SubscriptionRoutingModule} from './subscription-routing.module';
import {SubscriptionComponent} from './subscription.component';
import {FormsModule} from '@angular/forms';
import {StripeBillingModule} from '../../../modules/stripe-billing/stripe-billing.module';
import {MatDialogModule} from '@angular/material/dialog';
import {TranslateModule} from '@ngx-translate/core';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {ToastService} from '../../framework/core/services/toast.service';
import {HttpClientModule} from '@angular/common/http';
import {CommonExtensions} from '../../LayoutsComponents/CommonExtensions.module';

@NgModule({
    providers: [
        MatSnackBar,
        MatSnackBarModule,
        ToastService
    ],    
    declarations: [SubscriptionComponent],
    imports: [
        CommonModule,
        FormsModule,
        CommonExtensions,
        StripeBillingModule,
        InlineSVGModule,
        TranslateModule,        
        HttpClientModule,        
        MatDialogModule,
        SubscriptionRoutingModule
    ]
})
export class SubscriptionModule {
}
