import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {UserService} from '../../../../services/user.service';
import {TranslationService} from '../../../../services/translation.service';
import {ToastService} from '../../../framework/core/services/toast.service';
import {SubheaderService} from '../../../LayoutsComponents/subheader/_services/subheader.service';
import {Tarif, TarifService} from '../../../../services/tarif.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {StripeBillingConfig} from '../../../../modules/stripe-billing/stripe-billing.objects';
import {StripeBillingComponent} from '../../../../modules/stripe-billing/stripe-billing.component';
import {StripeSubscriptionService} from '../../../../services/stripe-subscription.service';
import {SettingsService} from '../../../../services/settings.service';

@Component({
    selector: 'app-change-tarif',
    templateUrl: './change-tarif.component.html',
    styleUrls: ['./change-tarif.component.scss']
})
export class ChangeTarifComponent implements OnInit, OnDestroy {

    subscriptions: Subscription[] = [];
    isLoading$: Observable<boolean>;

    tarifs: Tarif[];
    user: any ;
    currentTarif: Tarif;

    isCancelSubscription = false;

    selectedTarifIndex = -1;
    selectedTarifPeriod = '';

    backUrl: string;
    public stripe_settings: any;

    monthlyPriceIds = ['price_1KBUGoBtgHko6XgqrrQ2vayK', 'price_1KBUG2BtgHko6XgqqrDnfraQ', 'price_1KBUFKBtgHko6XgqsWeRlaPN'];
    yearlyPriceIds = ['price_1KBUGoBtgHko6XgqjMV4Covy', 'price_1KBUG2BtgHko6XgqYn92EZfx', 'price_1KBUFKBtgHko6XgqMDbh7l2r'];

    constructor(private subheader: SubheaderService, private toastService: ToastService, private userService: UserService,
                private fb: FormBuilder, private translationService: TranslationService, private tarifService: TarifService,
                private changeDetectorRef: ChangeDetectorRef, private activateRoute: ActivatedRoute, private router: Router,
                private settingsService:SettingsService, 
                private dialog: MatDialog, private stripeSubscriptionService: StripeSubscriptionService) {
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.subheader.setTitle('PROFILE.FULL.CHANGE_TARIF');
            this.subheader.setBreadcrumbs([{
                title: 'PROFILE.TOP.MY_PROFILE',
                linkText: 'PROFILE.TOP.MY_PROFILE',
                linkPath: '/user-profile'
            }]);
        }, 1);

        const getUser = this.userService.current();
        const getTarifs = this.tarifService.loadTarifs(this.translationService.getSelectedLanguage());
        const getSettings = this.settingsService.getStripeSettings();

        this.isLoading$ = new Observable<boolean>(observer => {
            observer.next(true);
            Promise.all([getUser, getTarifs, getSettings]).then(response => {
                this.user = response[0];
                this.tarifs = response[1];

                this.tarifs.sort((t1, t2) => {
                    return t1.sort - t2.sort;
                });

                for (let i = 0; i < this.tarifs.length; i++) {
                    if (this.tarifs[i].id === this.user.current_plan) {
                        this.currentTarif = this.tarifs[i];
                        break;
                    }
                }

                this.stripe_settings = response[2];
                console.log(this.stripe_settings);

                this.changeDetectorRef.detectChanges();
                observer.next(false);
            });
        });
        this.user = {};
        const querySubscription = this.activateRoute.queryParams.subscribe((queryParam: any) => {
                this.backUrl = queryParam['b'];
            }
        );
        this.subscriptions.push(querySubscription);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }

    /**
     * Click event on month tarif button.
     *
     * @param positionNumber number in tarifs list
     */
    clickTarifMonth(positionNumber: number, tarif:any) {
        this.selectedTarifIndex = positionNumber;
        this.selectedTarifPeriod = 'month';
        this.changeDetectorRef.detectChanges();
    }

    /**
     * Click event on year tarif button.
     *
     * @param positionNumber number in tarifs list
     */
    clickTarifYear(positionNumber: number, tarif:any) {
        this.selectedTarifIndex = positionNumber;
        this.selectedTarifPeriod = 'year';
        this.changeDetectorRef.detectChanges();
    }

    /**
     * Click event on cancel tarif button.
     *
     * @param positionNumber number in tarifs list
     */
    clickTarifCancel(positionNumber: number, tarif:any) {
        this.selectedTarifIndex = -1;
        this.selectedTarifPeriod = '';
        this.changeDetectorRef.detectChanges();
    }

    /**
     * Click event on confirm tarif button.
     *
     * @param positionNumber number in tarifs list
     */
    clickTarifConfirm(positionNumber: number, tarif:any) {
        this.isLoading$ = new Observable<boolean>(observer => {
            observer.next(true);
            console.log('TARRIF-INDEX', this.selectedTarifIndex);
            console.log('TARRIF-TYPE', this.selectedTarifPeriod);

            if ((this.tarifs[this.selectedTarifIndex].cost_month === 0 && this.selectedTarifPeriod === 'month') ||
                (this.tarifs[this.selectedTarifIndex].cost_year === 0 && this.selectedTarifPeriod === 'year')) {

                this.userService.changeUserTarif(this.user.id, this.tarifs[positionNumber].id, this.selectedTarifPeriod)
                    .then(response => {
                        if (response.is_error) {
                            this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_NOT_SAVED'), 'danger');
                        } else {
                            this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_SAVED'), 'success');
                            this.currentTarif = this.tarifs[positionNumber];
                            this.selectedTarifIndex = -1;
                            this.selectedTarifPeriod = '';
                        }

                        setTimeout(() => {
                            if (this.backUrl) {
                                this.router.navigate([this.backUrl]);
                            }
                        }, 2000);

                        observer.next(false);
                    });

            } else {
                let priceId = this.selectedTarifPeriod === 'month' ? this.monthlyPriceIds[this.selectedTarifIndex] : this.yearlyPriceIds[this.selectedTarifIndex];

                //if (this.selectedTarifPeriod === 'month') priceId = this.tarifs[this.selectedTarifIndex].stripe_month_price_id;
                //if (this.selectedTarifPeriod === 'year') priceId = this.tarifs[this.selectedTarifIndex].stripe_year_price_id;

                /*this.stripe_settings.tarifs.forEach(element => {
                    if (element.id==tarif.id && this.selectedTarifPeriod === 'month') priceId = element.stripe_month_price_id;
                    if (element.id==tarif.id && this.selectedTarifPeriod === 'year') priceId = element.stripe_year_price_id;
                });   */                 
                this.stripe_settings.tarifs.forEach(element => {
                    if (element.id==tarif.id && this.selectedTarifPeriod === 'month') priceId = element.stripe_month_price_id;
                    if (element.id==tarif.id && this.selectedTarifPeriod === 'year') priceId = element.stripe_year_price_id;
                });

                console.log('STRIPE_SETTINGS', this.stripe_settings);
                console.log('CURRENT_TARIF', tarif);
                console.log('TARRIF-PRICE', priceId);
                const dialogConfig = new MatDialogConfig();
                dialogConfig.disableClose = true;
                dialogConfig.autoFocus = true;
                dialogConfig.width = '500px';
                dialogConfig.data = new StripeBillingConfig(this.user.name, this.user.email, this.user.id, priceId, true);
                const dialogRef = this.dialog.open(StripeBillingComponent, dialogConfig);
                dialogRef.afterClosed().subscribe(result => {
                    if (result) {
                        this.userService.changeUserTarif(this.user.id, this.tarifs[positionNumber].id, this.selectedTarifPeriod)
                            .then(response => {
                                if (response.is_error) {
                                    this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_NOT_SAVED'), 'danger');
                                } else {
                                    this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_SAVED'), 'success');
                                    this.currentTarif = this.tarifs[positionNumber];
                                    this.selectedTarifIndex = -1;
                                    this.selectedTarifPeriod = '';
                                }

                                setTimeout(() => {
                                    if (this.backUrl) {
                                        this.router.navigate([this.backUrl]);
                                    }
                                }, 2000);

                                observer.next(false);
                            });
                    } else {
                        console.log('SubscriptionComponent', 'FAILED');
                        observer.next(false);
                    }
                });
            }
        });

    }

    cancelSubscription() {
        this.isLoading$ = new Observable<boolean>(observer => {
            observer.next(true);
            this.stripeSubscriptionService.cancelSubscription(this.user.id).then(response => {
                this.currentTarif = null;
                observer.next(false);
            });
        });
    }



    cancel() {
   
        if (this.backUrl) {
          this.router.navigate([this.backUrl]);
        }
      }    
}
