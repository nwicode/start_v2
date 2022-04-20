import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserWithdrawalsService} from '../../../../../services/user-withdrawals.service';
import {UserWithdrawal} from "../withdrawalsObjects";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-add-withdrawal-request',
    templateUrl: './add-withdrawal-request.component.html',
    styleUrls: ['./add-withdrawal-request.component.scss']
})
export class AddWithdrawalRequestComponent implements OnInit {
    public isLoading$: Observable<boolean>;
    public formGroup: FormGroup;
    public withdrawal: any = {};
    public backUrl: any = '';

    constructor(public userWithdrawalsService: UserWithdrawalsService, private fb: FormBuilder, private router: Router,
                private activateRoute: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.loadForm();
        this.activateRoute.queryParams.subscribe((queryParam: any) => {
                this.backUrl = queryParam['b'];
            }
        );
    }

    loadForm() {
        this.formGroup = this.fb.group({
            amount: [this.withdrawal.amount, Validators.required],
            description: [this.withdrawal.description, Validators.required],
        });
    }

    requestWithdrawal() {
        const formValues = this.formGroup.value;
        const userWithdrawal = new UserWithdrawal();
        userWithdrawal.amount = formValues.amount;
        userWithdrawal.description = formValues.description;
        this.userWithdrawalsService.addWithdrawal(userWithdrawal).subscribe(
            success => {
                console.log('requestWithdrawal', success);
                this.router.navigate(['user-page/withdrawals']);
            }, error => {
                console.log('requestWithdrawal', error);
            }
        );
    }
}
