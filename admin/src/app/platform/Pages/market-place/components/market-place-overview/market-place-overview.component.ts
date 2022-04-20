import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AuthService, UserModel} from '../../../../../modules/auth';
import {Observable} from 'rxjs';
import {LicenseService} from "../../../../../services/license.service";
import {ConfigService} from "../../../../../services/config.service";

@Component({
    selector: 'app-market-place-overview',
    templateUrl: './market-place-overview.component.html',
    styleUrls: ['./market-place-overview.component.scss']
})
export class MarketPlaceOverviewComponent implements OnInit {
    public user$: Observable<UserModel>;

    has_new_version = false;

    constructor(public userService: AuthService, public licenseService: LicenseService, private changeDetectorRef: ChangeDetectorRef, private configService: ConfigService) {
        this.user$ = this.userService.currentUserSubject.asObservable();
    }

    ngOnInit(): void {
        this.configService.getConfig().then(config => {
            if ((<any>config).last_check_date) {
                let check_date: any = new Date((<any>config).last_check_date);
                if ((Date.now() - check_date) > 60 * 60 * 1000) {
                    this.licenseService.checkUpdates().then(async response => {
                        this.has_new_version = response.status;
                        this.changeDetectorRef.detectChanges();
                    });
                }
            }
        });
    }

}
