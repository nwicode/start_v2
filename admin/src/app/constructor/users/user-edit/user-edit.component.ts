import {Component, OnInit} from '@angular/core';
import {User} from '../users.objects';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable, of, Subscription} from 'rxjs';
import {ApplicationUsersService} from '../../../services/application-users.service';
import {ActivatedRoute, Router} from '@angular/router';
import {catchError, switchMap, tap} from 'rxjs/operators';

const EMPTY_APP_USER: User = {
    id: 0,
    app_id: '',
    name: '',
    lastname: '',
    mail: '',
    phone: '',
    password: '',
    balance: 0,
    role: 0,
    blocked: false,
    avatar: '',
    last_date: '',
};


@Component({
    selector: 'app-user-edit',
    templateUrl: './user-edit.component.html',
    styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
    id: number;
    appUser: User;
    previous: User;
    formGroup: FormGroup;
    isLoading$: Observable<boolean>;
    errorMessage = '';
    tabs = {
        BASIC_TAB: 0,
        REMARKS_TAB: 1,
        SPECIFICATIONS_TAB: 2
    };
    activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info | 1 => Remarks | 2 => Specifications
    private subscriptions: Subscription[] = [];
    applicationId: number;
    constructor(private fb: FormBuilder, private applicationUsersService: ApplicationUsersService, private router: Router,
                private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.applicationId = Number(this.router.url.match(/constructor\/(\d+)/)[1]);
        this.isLoading$ = this.applicationUsersService.isLoading$;
        this.loadProduct();
    }

    loadProduct() {
        const sb = this.route.paramMap.pipe(
            switchMap(params => {
                // get id from URL
                this.id = Number(params.get('id'));
                if (this.id || this.id > 0) {
                    return this.applicationUsersService.getItemById(this.applicationId,this.id);
                }
                return of(EMPTY_APP_USER);
            }),
            catchError((errorMessage) => {
                this.errorMessage = errorMessage;
                return of(undefined);
            }),
        ).subscribe((res: User) => {
            if (!res) {
                this.router.navigate(['../../users'], {relativeTo: this.route});
            }
            this.appUser = res;
            this.previous = Object.assign({}, res);
            this.loadForm();
        });
        this.subscriptions.push(sb);
    }

    loadForm() {
        if (!this.appUser) {
            return;
        }

        this.formGroup = this.fb.group({
            app_id: [this.appUser.app_id],
            name: [this.appUser.name, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
            lastname: [this.appUser.lastname, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
            mail: [this.appUser.mail, Validators.compose([Validators.required, Validators.email])],
            phone: [this.appUser.phone, Validators.compose([Validators.required, Validators.minLength(8)])],
            password: [this.appUser.password, Validators.compose([Validators.required, Validators.minLength(8)])],
            /*balance: [this.appUser.balance, Validators.compose([
                Validators.required,
                Validators.min(0),
                Validators.max(1000000)
            ])],
            role: [this.appUser.role],
            last_date: [this.appUser.last_date],
            avatar: [this.appUser.avatar],*/
            blocked: [this.appUser.blocked],
        });
    }

    reset() {
        if (!this.previous) {
            return;
        }

        this.appUser = Object.assign({}, this.previous);
        this.loadForm();
    }

    changeTab(tabId: number) {
        this.activeTabId = tabId;
    }

    save() {
        this.formGroup.markAllAsTouched();
        if (!this.formGroup.valid) {
            return;
        }
        const formValues = this.formGroup.value;
        this.appUser = Object.assign(this.appUser, formValues);
        if (this.id) {
            this.edit();
        } else {
            this.create();
        }
    }

    edit() {
        this.appUser.app_id = this.applicationId.toString();
        const sbUpdate = this.applicationUsersService.update(this.appUser).pipe(
            tap(() => this.router.navigate(['../../../users'], {relativeTo: this.route})),
            catchError((errorMessage) => {
                console.error('UPDATE ERROR', errorMessage);
                return of(this.appUser);
            })
        ).subscribe(res => this.appUser = res);
        this.subscriptions.push(sbUpdate);
    }

    create() {
        console.log(this.appUser);
        this.appUser.app_id = this.applicationId.toString();
        const sbCreate = this.applicationUsersService.create(this.appUser).pipe(
            tap(() => this.router.navigate(['../../users'], {relativeTo: this.route})),
            catchError((errorMessage) => {
                console.error('UPDATE ERROR', errorMessage);
                return of(this.appUser);
            })
        ).subscribe(res => this.appUser = res as User);
        this.subscriptions.push(sbCreate);
    }

    // helpers for View
    isControlValid(controlName: string): boolean {
        const control = this.formGroup.controls[controlName];
        return control.valid && (control.dirty || control.touched);
    }

    isControlInvalid(controlName: string): boolean {
        const control = this.formGroup.controls[controlName];
        return control.invalid && (control.dirty || control.touched);
    }

    controlHasError(validation: string, controlName: string) {
        const control = this.formGroup.controls[controlName];
        return control.hasError(validation) && (control.dirty || control.touched);
    }

    isControlTouched(controlName: string): boolean {
        const control = this.formGroup.controls[controlName];
        return control.dirty || control.touched;
    }
}
