import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StripeBillingComponent} from './stripe-billing.component';
import {NgxStripeModule} from 'ngx-stripe';
import {environment} from '../../../environments/environment';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
declare var STRIPE_KEY;

@NgModule({
    exports: [StripeBillingComponent],
    declarations: [StripeBillingComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgxStripeModule.forRoot(STRIPE_KEY),
    ]
})
export class StripeBillingModule {
}
