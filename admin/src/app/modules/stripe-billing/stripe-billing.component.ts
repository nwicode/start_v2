import {Component, Inject, LOCALE_ID, OnInit, ViewChild} from '@angular/core';
import {StripeCardNumberComponent, StripeService} from 'ngx-stripe';
import {
    StripeCardElementOptions,
    StripeElementsOptions
} from '@stripe/stripe-js';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable, Subscription} from 'rxjs';
import {FormBuilder, FormGroup, Validator, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {StripeBillingConfig} from './stripe-billing.objects';

declare var STRIPE_KEY;

@Component({
    selector: 'app-stripe-billing',
    templateUrl: './stripe-billing.component.html',
    styleUrls: ['./stripe-billing.component.scss']
})
export class StripeBillingComponent implements OnInit {
    public billingInfo = new StripeBillingConfig('', '', '', '', false);
    public isLoading = false;
    public error_message: any = "";

    @ViewChild(StripeCardNumberComponent) card: StripeCardNumberComponent;
    cardOptions: StripeCardElementOptions = {
        style: {
            base: {
                iconColor: '#666EE8',
                color: '#31325F',
                fontWeight: '300',
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSize: '18px',
                '::placeholder': {
                    color: '#CFD7E0'
                }
            }
        }
    };
    elementsOptions: StripeElementsOptions = {
        locale: 'en'
    };

    stripeForm: FormGroup;

    constructor(public dialogRef: MatDialogRef<StripeBillingComponent>, @Inject(LOCALE_ID) private locale: string,
                @Inject(MAT_DIALOG_DATA) billingInfo: StripeBillingConfig, private http: HttpClient, private stripeService: StripeService,
                private fb: FormBuilder) {
        this.billingInfo = billingInfo;
    }

    ngOnInit(): void {
        this.stripeForm = this.fb.group({
            email: ['email', [Validators.required]]
        });
        this.stripeForm.setValue({email: this.billingInfo.email});

        //this.stripeService.setKey(environment.stripePubKey);
        this.stripeService.setKey(STRIPE_KEY);
    }

    checkout() {
        if (this.stripeForm.valid) {
            this.isLoading = true;
            this.createCustomer('', this.billingInfo.email, '').subscribe(
                customer => {
                    console.log('customer', customer);

                    this.createPaymentMethod().subscribe(paymentMethod => {

                        console.log("paymentMethod");
                        console.log(paymentMethod);
                        if (paymentMethod.error) {
                            this.error_message = paymentMethod.error.message;
                        } else {
                            console.log('createPaymentMethod', paymentMethod.paymentMethod.id);
                            this.createSubscription(customer.toString(), this.billingInfo.priseId, paymentMethod.paymentMethod.id,
                                this.billingInfo.isRecurrent).subscribe(
                                subscription => {
                                    this.dialogRef.close(subscription);
                                }, error3 => {
                                    console.log('error3', error3);
                                    this.error_message = error3;
                                }
                            );
                        }

                    }, error =>{
                        console.log(" createPaymentMethod error:");
                        console.log(error);
                        this.error_message = error;
                    });

                }, customerError => {
                    console.log('customerError', customerError);
                }
            );
        }
    }

    cancel() {
        this.dialogRef.close();
    }

    private createCustomer(nameData: string, emailData: string, phoneData: string) {
        return this.http.post(
            `${environment.apiUrl}api/create_customer`,
            {
                name: nameData,
                email: emailData,
                phone: phoneData
            }
        );
    }

    private createPaymentMethod() {
        return this.stripeService.createPaymentMethod({
            type: 'card',
            card: this.card.element,
            billing_details: {email: this.billingInfo.email}
        });
    }

    private createSubscription(customerData: string, priceId: string, paymentMethodId: string, isRecurrent: boolean):
        Observable<Subscription> {
        return this.http.post<Subscription>(
            `${environment.apiUrl}api/create_subscription`,
            {
                customer: customerData,
                price_id: priceId,
                payment_method_id: paymentMethodId,
                cancel_at_period_end: !isRecurrent
            }
        );
    }

}
