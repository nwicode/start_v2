import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {UserWithdrawalsService} from '../../../services/user-withdrawals.service';
import {HttpParams} from '@angular/common/http';
import {UserWithdrawal} from "../user-page/withdrawals/withdrawalsObjects";

@Component({
    selector: 'app-settings-withdrawals',
    templateUrl: './settings-withdrawals.component.html',
    styleUrls: ['./settings-withdrawals.component.scss']
})
export class SettingsWithdrawalsComponent implements OnInit {
    public isLoading$: Observable<boolean>;
    public start = 0;
    public limit = 25;
    public total = 25;

    constructor(public userWithdrawalsService: UserWithdrawalsService) {
    }


    ngOnInit(): void {
        this.userWithdrawalsService.getWithdrawals(this.getUserWithdrawalsFilter());
    }

    private getUserWithdrawalsFilter(): HttpParams {
        return new HttpParams()
            .set('is_admin', '1')
            .set('start', String(this.start))
            .set('limit', String(this.limit));
    }

    reviewing(withdrawal: UserWithdrawal) {
        withdrawal.status = 'REVIEWING';
        this.userWithdrawalsService.updateWithdrawal(withdrawal).subscribe(res => {
            this.userWithdrawalsService.getWithdrawals(this.getUserWithdrawalsFilter());
        }, error => {
            this.userWithdrawalsService.getWithdrawals(this.getUserWithdrawalsFilter());
        });
    }

    approve(withdrawal: UserWithdrawal) {
        withdrawal.status = 'APPROVED';
        this.userWithdrawalsService.updateWithdrawal(withdrawal).subscribe(res => {
            this.userWithdrawalsService.getWithdrawals(this.getUserWithdrawalsFilter());
        }, error => {
            this.userWithdrawalsService.getWithdrawals(this.getUserWithdrawalsFilter());
        });
    }

    reject(withdrawal: UserWithdrawal) {
        withdrawal.status = 'REJECTED';
        this.userWithdrawalsService.updateWithdrawal(withdrawal).subscribe(res => {
            this.userWithdrawalsService.getWithdrawals(this.getUserWithdrawalsFilter());
        }, error => {
            this.userWithdrawalsService.getWithdrawals(this.getUserWithdrawalsFilter());
        });
    }
}
