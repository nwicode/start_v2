import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {SubheaderService} from '../../../LayoutsComponents/subheader/_services/subheader.service';
import {ReferralProgramsService} from '../../../../services/referral-programs.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ReferralProgram} from '../settings-referrals.objects';

@Component({
    selector: 'app-add-referral-program',
    templateUrl: './add-referral-program.component.html',
    styleUrls: ['./add-referral-program.component.scss']
})
export class AddReferralProgramComponent implements OnInit {
    public pageSizeOptions: number[] = [25, 50, 100, 500];
    public formGroup: FormGroup;
    public referralProgram: any = {};
    public isLoading$: Observable<boolean>;
    public start = 0;
    public limit = 25;
    public total = 25;

    constructor(public referralProgramsService: ReferralProgramsService, private subHeaderService: SubheaderService,
                private fb: FormBuilder, private router: Router) {
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.subHeaderService.setTitle('Add Referral');
            this.subHeaderService.setBreadcrumbs([{
                title: 'Referral Programs',
                linkText: 'Referral Programs',
                linkPath: '/referrals/referral-programs'
            }]);
        }, 1);
        this.loadForm();
    }

    loadForm() {
        this.formGroup = this.fb.group({
            name: [this.referralProgram.name, Validators.required],
            path: [this.referralProgram.path, Validators.required],
            life_time: [this.referralProgram.life_time, Validators.required],
        });
    }

    addReferralProgram() {
        const formValues = this.formGroup.value;
        const referralProgram = new ReferralProgram();
        referralProgram.name = formValues.name;
        referralProgram.uri = formValues.path;
        referralProgram.lifeTimeMinutes = formValues.life_time;
        this.referralProgramsService.addReferralProgram(referralProgram).subscribe(
            success => {
                console.log('referralProgram', success);
                this.router.navigate(['referrals/referral-programs']);
            }, error => {
                console.log('referralProgram', error);
            }
        );
    }


}
