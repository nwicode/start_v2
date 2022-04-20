import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {SubheaderService} from '../../LayoutsComponents/subheader/_services/subheader.service';
import {Observable} from 'rxjs';
import {ReferralProgramsService} from '../../../services/referral-programs.service';
import {HttpParams} from '@angular/common/http';
import {ReferralProgram} from "./settings-referrals.objects";

@Component({
    selector: 'app-settings-referrals',
    templateUrl: './settings-referrals.component.html',
    styleUrls: ['./settings-referrals.component.scss']
})
export class SettingsReferralsComponent implements OnInit {
    public pageSizeOptions: number[] = [25, 50, 100, 500];
    public referralUsers: any[] = [];
    public isLoading$: Observable<boolean>;
    public start = 0;
    public limit = 25;
    public total = 25;

    constructor(public referralProgramsService: ReferralProgramsService, private subHeaderService: SubheaderService) {

    }

    ngOnInit(): void {
        this.referralProgramsService.getReferralPrograms(this.getReferralProgramFilter());
        this.isLoading$ = new Observable<boolean>(observer => {
            observer.next(true);
        });
        setTimeout(() => {
            this.subHeaderService.setTitle('Referral Settings');
            this.subHeaderService.setBreadcrumbs([{
                title: 'Referral Settings',
                linkText: 'Referral Settings',
                linkPath: '/referrals/referral-programs'
            }]);
        }, 1);
    }

    private getReferralProgramFilter(): HttpParams {
        return new HttpParams()
            .set('start', String(this.start))
            .set('limit', String(this.limit));
    }

    deleteReferralProgram(referralProgram: ReferralProgram) {
        this.referralProgramsService.deleteReferralProgram(referralProgram.id).subscribe(
            success => {
                console.log('deleteReferralProgram', success);
                this.referralProgramsService.isLoading$.next(true);
                this.referralProgramsService.getReferralPrograms(this.getReferralProgramFilter());
            }, error => {
                console.log('deleteReferralProgram', error);
                this.referralProgramsService.isLoading$.next(true);
                this.referralProgramsService.getReferralPrograms(this.getReferralProgramFilter());
            }
        );
    }

}
