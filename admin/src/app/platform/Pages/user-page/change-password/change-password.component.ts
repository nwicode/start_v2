import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { ConfirmPasswordValidator } from '../../../../validators/confirm-password.validator';
import {UserService} from '../../../../services/user.service';
import {TranslationService} from "../../../../services/translation.service";
import {ToastService} from '../../../framework/core/services/toast.service';
import { SubheaderService } from '../../../LayoutsComponents/subheader/_services/subheader.service';
import {ActivatedRoute, Router} from "@angular/router";


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  user: any;
  firstUserState: any;
  subscriptions: Subscription[] = [];
  isLoading$: Observable<boolean>;
  isWrong: boolean;

  backUrl: string;

  constructor(private subheader: SubheaderService, private toastService: ToastService, private userService: UserService, private fb: FormBuilder, private translationService: TranslationService, private activateRoute: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {

    setTimeout(() => {
      this.subheader.setTitle('PROFILE.FULL.CHANGE_PASSWORD');
      this.subheader.setBreadcrumbs([{
        title: 'PROFILE.TOP.MY_PROFILE',
        linkText: 'PROFILE.TOP.MY_PROFILE',
        linkPath: '/user-profile'
      }]);
    }, 1);

    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      this.userService.current().then(user => {
        this.user = Object.assign({}, user);
        this.firstUserState = Object.assign({}, user);
        this.loadForm();
        observer.next(false);
      });
    });
        
    this.user = {};
    this.isWrong = false;
    this.loadForm();

    let querySubscription = this.activateRoute.queryParams.subscribe((queryParam: any) => {
          this.backUrl = queryParam['b'];
        }
    );
    this.subscriptions.push(querySubscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  loadForm() {
    this.formGroup = this.fb.group({
      currentPassword: ['', Validators.required],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)])],
      cPassword: ['', Validators.required]
    }, {
      validator: ConfirmPasswordValidator.MatchPassword
    });
  }

  save() {
    this.formGroup.markAllAsTouched();
    if (!this.formGroup.valid) {
      return;
    }

    const formValues = this.formGroup.value;
    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      this.formGroup.disable();
      this.userService.changePassword(formValues.currentPassword, formValues.password).then((response) => {
        observer.next(false);
        this.formGroup.enable();
        if (response.is_error) {
          this.isWrong = true;
          this.toastService.showsToastBar(this.translationService.translatePhrase('PROFILE.FULL.PASSWORD_NOT_CHANGED'), 'warning');
        } else {
          this.toastService.showsToastBar(this.translationService.translatePhrase('PROFILE.FULL.PASSWORD_CHANGED'), 'success');
          this.isWrong = false;
          this.userService.current();
          this.loadForm();

          setTimeout(() => {
            if (this.backUrl) {
              this.router.navigate([this.backUrl]);
            }
          }, 2000);
        }
      });
    });
  }

  cancel() {
    this.loadForm();

    if (this.backUrl) {
      this.router.navigate([this.backUrl]);
    }
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

  controlHasError(validation, controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.dirty || control.touched;
  }
}
