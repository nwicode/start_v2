import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {SubheaderService} from '../../../LayoutsComponents/subheader/_services/subheader.service';
import {ReferralProgramsService} from '../../../../services/referral-programs.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ReferralProgram} from "../settings-referrals.objects";

@Component({
    selector: 'app-update-referral-program',
    templateUrl: './update-referral-program.component.html',
    styleUrls: ['./update-referral-program.component.scss']
})
export class UpdateReferralProgramComponent implements OnInit {
    public pageSizeOptions: number[] = [25, 50, 100, 500];
    public isLoading$: Observable<boolean>;
    public referralProgramId = '';
    public formGroup: FormGroup;
    public referralProgram: ReferralProgram = new ReferralProgram();
    public start = 0;
    public limit = 25;
    public total = 25;

    constructor(public referralProgramsService: ReferralProgramsService, private subHeaderService: SubheaderService,
                private route: ActivatedRoute, private fb: FormBuilder, private router: Router) {
    }

    ngOnInit(): void {
        this.referralProgramId = this.route.snapshot.paramMap.get('id');
        setTimeout(() => {
            this.subHeaderService.setTitle('Update Referral');
            this.subHeaderService.setBreadcrumbs([{
                title: 'Referral Programs',
                linkText: 'Referral Settings',
                linkPath: '/referrals/referral-programs'
            }]);
        }, 1);
        this.referralProgramsService.getReferralProgram(this.referralProgramId).subscribe(res => {
            const referralProgram = new ReferralProgram();
            referralProgram.setData(res.item);
            this.referralProgram = referralProgram;
            this.formGroup.setValue({
                name: referralProgram.name,
                uri: referralProgram.uri,
                lifeTimeMinutes: referralProgram.lifeTimeMinutes
            });
            this.referralProgramsService.isLoading$.next(false);
            console.log('UpdateReferralProgramComponent', referralProgram);
        }, error => {
            this.referralProgramsService.isLoading$.next(false);
            this.router.navigate(['referrals/referral-programs']);
            console.log('UpdateReferralProgramComponent', error);
        });
        this.loadForm();
    }

    loadForm() {
        this.formGroup = this.fb.group({
            name: [this.referralProgram.name, Validators.required],
            uri: [this.referralProgram.uri, Validators.required],
            lifeTimeMinutes: [this.referralProgram.lifeTimeMinutes, Validators.required],
        });
    }

    updateReferralProgram() {
        const formValues = this.formGroup.value;
        this.referralProgram.name = formValues.name;
        this.referralProgram.uri = formValues.uri;
        this.referralProgram.lifeTimeMinutes = formValues.lifeTimeMinutes;
        this.referralProgramsService.updateReferralProgram(this.referralProgram).subscribe(
            success => {
                console.log('referralProgram', success);
                this.router.navigate(['referrals/referral-programs']);
            }, error => {
                console.log('referralProgram', error);
            }
        );
    }

}
