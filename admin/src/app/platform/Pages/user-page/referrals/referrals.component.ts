import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpParams} from '@angular/common/http';
import {UserReferralsService} from '../../../../services/user-referrals.service';

@Component({
    selector: 'app-referrals',
    templateUrl: './referrals.component.html',
    styleUrls: ['./referrals.component.scss']
})
export class ReferralsComponent implements OnInit {
    public pageSizeOptions: number[] = [25, 50, 100, 500];
    public referralUsers: any[] = [];
    public isLoading$: Observable<boolean>;
    public start = 0;
    public limit = 25;
    public total = 25;

    constructor(public userReferralsService: UserReferralsService) {
        // this.referralUsers.push({});
        // this.referralUsers.push({});
        // this.referralUsers.push({});
    }


    ngOnInit(): void {
        this.userReferralsService.getUserReferrals(this.getUserReferralFilter());
    }

    private getUserReferralFilter(): HttpParams {
        let param = new HttpParams()
            .set('start', String(this.start))
            .set('limit', String(this.limit));
        return param;
    }

}
