import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../../services/user.service';
import {Observable} from 'rxjs';
import {Subscription} from 'rxjs';
import {ToastService} from '../../framework/core/services/toast.service';
import {SubheaderService} from '../../LayoutsComponents/subheader/_services/subheader.service';
import {environment} from '../../../../environments/environment';
import {ActivatedRoute, Router} from "@angular/router";
import {ReferralProgramsService} from "../../../services/referral-programs.service";
import {ReferralProgram} from "../settings-referrals/settings-referrals.objects";
import {UserReferralLink} from "./referrals/referralsObjects";
import {Clipboard} from '@angular/cdk/clipboard';


@Component({
    selector: 'app-user-page',
    templateUrl: './user-page.component.html',
    styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent implements OnInit, OnDestroy {
    private toastService: ToastService;

    subscriptions: Subscription[] = [];
    //user get data subscription
    userUpdateSubscription: Subscription;
    userLoaded: boolean = false;
    userCurrent: any;
    avatar: any;

    backUrl: string;

    constructor(private subheader: SubheaderService, private userService: UserService, private ref: ChangeDetectorRef,
                private activateRoute: ActivatedRoute, public referralProgramsService: ReferralProgramsService, private clipboard: Clipboard) {
        this.userUpdateSubscription = this.userService.onUserUpate().subscribe(data => {
            this.userLoaded = true;
            this.userCurrent = data.result;
            this.avatar = this.userCurrent.avatar
            console.log("this.userCurrent");
            console.log(this.userCurrent);
            if (!this.avatar) {
                this.avatar = "./assets/media/users/blank.png";
            } else {
                this.avatar = environment.apiUrl + "storage/users/avatars/" + this.avatar;
            }
            this.ref.detectChanges();
        });
        this.userService.current();
    }

    ngOnInit(): void {
        this.referralProgramsService.getReferralPrograms();
        let querySubscription = this.activateRoute.queryParams.subscribe((queryParam: any) => {
                this.backUrl = queryParam['b'];
            }
        );
        this.subscriptions.push(querySubscription);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }

    getUserReferralProgramLink(referralProgram: ReferralProgram) {
        this.referralProgramsService.getUserReferralProgram(referralProgram.id).subscribe(
            res => {
                console.log('getUserReferralProgramLink', res);
                const referralLink = new UserReferralLink();
                referralLink.setData(res);
                const url = 'http://127.0.0.1:4200/' + referralProgram.uri + '?ref=' + referralLink.code;
                const pending = this.clipboard.beginCopy(url);
                pending.copy();
                console.log('getUserReferralProgramLink', url);
            }, error => {
                console.log('getUserReferralProgramLink', error);
            }
        );
    }

}
