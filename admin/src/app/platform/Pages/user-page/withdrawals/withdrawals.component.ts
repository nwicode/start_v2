import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {UserWithdrawalsService} from '../../../../services/user-withdrawals.service';
import {HttpParams} from '@angular/common/http';

@Component({
    selector: 'app-withdrawals',
    templateUrl: './withdrawals.component.html',
    styleUrls: ['./withdrawals.component.scss']
})
export class WithdrawalsComponent implements OnInit {
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
        let param = new HttpParams()
            .set('start', String(this.start))
            .set('limit', String(this.limit));
        return param;
    }

}
