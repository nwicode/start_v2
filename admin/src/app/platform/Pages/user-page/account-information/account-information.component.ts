import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import {UserService} from '../../../../services/user.service';
import {TranslationService} from '../../../../services/translation.service';
import {ToastService} from '../../../framework/core/services/toast.service';
import { SubheaderService } from '../../../LayoutsComponents/subheader/_services/subheader.service';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-account-information',
  templateUrl: './account-information.component.html',
  styleUrls: ['./account-information.component.scss']
})
export class AccountInformationComponent implements OnInit, OnDestroy {
  user: any;
  firstUserState: any;
  formGroup: FormGroup;
  subscriptions: Subscription[] = [];
  isLoading$: Observable<boolean>;
  languages: any[];
  backUrl: string;

  constructor(private subheader: SubheaderService,private toastService: ToastService, private userService: UserService, private fb: FormBuilder, private translationService: TranslationService, private activateRoute: ActivatedRoute, private router: Router) {
  }

  async ngOnInit(){

    setTimeout(() => {
      this.subheader.setTitle('PROFILE.FULL.PERSONAL_INFORMATION');
      this.subheader.setBreadcrumbs([{
        title: 'PROFILE.TOP.MY_PROFILE',
        linkText: 'PROFILE.TOP.MY_PROFILE',
        linkPath: '/user-profile'
      }]);
    }, 1);
        
    this.user = {};
    await this.translationService.readLanguages();
    this.languages = this.translationService.getAvailableLanguages();
    //console.log(this.languages);
    this.loadForm();

    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      this.userService.current().then(user => {
        this.user = Object.assign({}, user);
        this.firstUserState = Object.assign({}, user);
        this.loadForm();
        observer.next(false);
      });
    });

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
      email: [this.user.email, Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320)])],
      defaultLanguage: [this.user.default_language, Validators.required]
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
    this.user = Object.assign(this.user, formValues);

    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      this.formGroup.disable();
      this.userService.saveAccountInformation(formValues.email, formValues.defaultLanguage).then((response) => {
        if (!response.is_error) {
          this.toastService.showsToastBar(this.translationService.translatePhrase('PROFILE.FULL.CHANGES_SAVED'), 'success');
          this.formGroup.enable();
          this.userService.current().then(user => {
            this.firstUserState = user;
          });

          setTimeout(() => {
            if (this.backUrl) {
              this.router.navigate([this.backUrl]);
            }
          }, 2000);
        }
        observer.next(false);
      });
    });
  }

  /**
   * Remove changes.
   */
  cancel() {
    this.user = Object.assign({}, this.firstUserState);
    this.loadForm();

    if (this.backUrl) {
      this.router.navigate([this.backUrl]);
    }
  }

  /**
   * Block account of the current user.
   */
  blockAccount() {
    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      this.formGroup.disable();
      this.userService.blockAccount()
          .then(() => {
            observer.next(false);
            this.toastService.showsToastBar(this.translationService.translatePhrase('PROFILE.FULL.ACCOUNT_BLOCKED'), 'success');
            this.formGroup.enable();
          });
    });
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
}
