import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {StripeBillingConfig} from '../../../modules/stripe-billing/stripe-billing.objects';
import {StripeBillingComponent} from '../../../modules/stripe-billing/stripe-billing.component';
import {Observable} from 'rxjs';
import {UserService} from '../../../services/user.service';
import {Router} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TarifService, Tarif } from "../../../services/tarif.service";
import { SubheaderService } from '../../LayoutsComponents/subheader/_services/subheader.service';
import { TranslationService } from '../../../services/translation.service';
import {SettingsService} from '../../../services/settings.service';

@Component({
    selector: 'app-subscription',
    templateUrl: './subscription.component.html',
    styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {
    public isYearly = true;
    public isRecurrent = true;
    public user: any;
    public stripe_settings: any;
    private monthlyPriceIds = ['price_1KBUGoBtgHko6XgqrrQ2vayK', 'price_1KBUG2BtgHko6XgqqrDnfraQ', 'price_1KBUFKBtgHko6XgqsWeRlaPN'];
    private yearlyPriceIds = ['price_1KBUGoBtgHko6XgqjMV4Covy', 'price_1KBUG2BtgHko6XgqYn92EZfx', 'price_1KBUFKBtgHko6XgqMDbh7l2r'];
    public isLoading = false;
    isLoading$: Observable<boolean>;

    tarifs: Tarif[] = [];
    currentAppLanguage: string;
    shift:number=3;
    was_loaded: boolean = false;
    constructor(private settingsService:SettingsService, private translationService: TranslationService,  private subheader:SubheaderService, private tarifService: TarifService, private dialog: MatDialog, private userService: UserService, private router: Router) {
    }

    ngOnInit(): void {

        this.currentAppLanguage = this.translationService.getSelectedLanguage();
        setTimeout(() => {
            this.subheader.setTitle('PAGE.SUBSCRIPTIONS.TITLE');
            this.subheader.setBreadcrumbs([{
              title: 'PAGE.SUBSCRIPTIONS.TITLE',
              linkText: 'PAGE.SUBSCRIPTIONS.TITLE',
              linkPath: '/subscriptions'
            }]);
          }, 1);

        this.isLoading = true;
        const getUser = this.userService.current();
        this.isLoading$ = new Observable<boolean>(observer => {
            observer.next(true);
            Promise.all([getUser, this.tarifService.loadTarifs(this.currentAppLanguage),this.settingsService.getStripeSettings()]).then(response => {
                this.user = response[0];
                let tarifList: Tarif[] = response[1];
                observer.next(false);
                this.isLoading = false;
                this.tarifs = tarifList.sort((a, b) => (a.sort < b.sort ? -1 : 1));
                console.log(this.tarifs);
                this.tarifs = this.tarifs.filter(function( obj ) {
                    return obj.active !== false;
                });
                this.tarifs = this.tarifs.slice(0, 3);
                if (this.tarifs.length>3) this.shift = 2;

                this.stripe_settings = response[2];
                console.log(this.stripe_settings);
                this.was_loaded = true;
            });
        });
    }


    subscribeService(tarif:any, isMonth:boolean = true) {
        let priceId:any="";
        this.stripe_settings.tarifs.forEach(element => {
            if (element.id==tarif.id && isMonth) priceId = element.stripe_month_price_id;
            if (element.id==tarif.id && !isMonth) priceId = element.stripe_year_price_id;
        });

        //const priceId = isMonthly ? this.monthlyPriceIds[selectedIndex] : this.yearlyPriceIds[selectedIndex];
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = '500px';
        dialogConfig.data = new StripeBillingConfig(this.user.name + ' ' + this.user.lastname, this.user.email, this.user.id, priceId, this.isRecurrent);
        const dialogRef = this.dialog.open(StripeBillingComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.router.navigate(['dashboard']);
            }
        });
    }

    chooseFreeTariff(tarif: any, isMonth: boolean = true) {
        if (tarif.cost_month==0 && tarif.cost_year==0) {
            this.userService.changeUserTarif(this.user.id, tarif.id, isMonth).then(response => {
                if (!response.is_error) {
                    this.router.navigate(['dashboard']);
                }
            });
        }
    }
    
    subscribeService1(selectedIndex: number, priceId:any) {
        //const priceId = isMonthly ? this.monthlyPriceIds[selectedIndex] : this.yearlyPriceIds[selectedIndex];
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = '500px';
        dialogConfig.data = new StripeBillingConfig(this.user.name + ' ' + this.user.lastname, this.user.email, this.user.id, priceId, this.isRecurrent);
        const dialogRef = this.dialog.open(StripeBillingComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.router.navigate(['dashboard']);
            }
        });
    }
}
