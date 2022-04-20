import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {ConfirmPasswordValidator} from '../../../../validators/confirm-password.validator';
import {UserService} from '../../../../services/user.service';
import {TranslationService} from "../../../../services/translation.service";
import {ToastService} from '../../../framework/core/services/toast.service';
import {SubheaderService} from '../../../LayoutsComponents/subheader/_services/subheader.service';
import {Router} from "@angular/router";


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
  userId: number;

  constructor(private subheader: SubheaderService, private toastService: ToastService, private userService: UserService, private fb: FormBuilder, private translationService: TranslationService, private router: Router) {
  }

  ngOnInit(): void {

    this.userId = Number(this.router.url.match(/edit-user\/(\d+)/)[1]);

    setTimeout(() => {
      this.subheader.setTitle('EDIT.USER.CHANGE_PASSWORD');
      this.subheader.setBreadcrumbs([{
        title: 'EDIT.USER.TITLE',
        linkText: 'EDIT.USER.TITLE',
        linkPath: '/edit-user/' + this.userId
      }]);
    }, 1);
        
    this.user = {};
    this.loadForm();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  /**
   * Init formGroup.
   */
  loadForm() {
    this.formGroup = this.fb.group({
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)])],
      cPassword: ['', Validators.required]
    }, {
      validator: ConfirmPasswordValidator.MatchPassword
    });
  }

  /**
   * Save changes.
   */
  save() {
    this.formGroup.markAllAsTouched();
    if (!this.formGroup.valid) {
      return;
    }

    const formValues = this.formGroup.value;
    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      this.formGroup.disable();
      this.userService.editUserPassword(this.userId, formValues.password).then((response) => {
        observer.next(false);
        this.formGroup.enable();
        if (response.is_error) {
          this.toastService.showsToastBar(this.translationService.translatePhrase('EDIT.USER.PASSWORD_NOT_CHANGED'), 'warning');
        } else {
          this.toastService.showsToastBar(this.translationService.translatePhrase('EDIT.USER.PASSWORD_CHANGED'), 'success');
          this.loadForm();
        }
      });
    });
  }

  /**
   * Remove changes.
   */
  cancel() {
    this.loadForm();
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
