import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {UserService} from '../../../../services/user.service';
import {TranslationService} from '../../../../services/translation.service';
import {ToastService} from '../../../framework/core/services/toast.service';
import {SubheaderService} from '../../../LayoutsComponents/subheader/_services/subheader.service';
import {Router} from "@angular/router";

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
  userId: number;
  is_load:boolean = false;

  constructor(private ref:ChangeDetectorRef, private subheader: SubheaderService,private toastService: ToastService, private userService: UserService, private fb: FormBuilder, private translationService: TranslationService, private router: Router) {
  }

  async ngOnInit() {
    this.userId = Number(this.router.url.match(/edit-user\/(\d+)/)[1]);

    setTimeout(() => {
      this.subheader.setTitle('EDIT.USER.ACCOUNT_INFORMATION');
      this.subheader.setBreadcrumbs([{
        title: 'EDIT.USER.TITLE',
        linkText: 'EDIT.USER.TITLE',
        linkPath: '/edit-user/' + this.userId
      }]);
    }, 1);
        
    this.user = {};
    await this.translationService.readLanguages();
    this.languages = this.translationService.getAvailableLanguages();
    this.loadForm();

    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      this.userService.getUserInformationById(this.userId).then(user => {
        this.user = Object.assign({}, user);
        this.firstUserState = Object.assign({}, user);
        this.loadForm();
        this.is_load = true;
        console.log("set is_load true");
        this.ref.detectChanges();
        observer.next(false);
      });
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  /**
   * Init formGroup.
   */
  loadForm() {
    this.formGroup = this.fb.group({
      email: [this.user.email, Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320)])],
      defaultLanguage: [this.user.default_language, Validators.required],
      role: [this.user.user_type_id, Validators.required]
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
      this.userService.editUserAccountInformation(this.userId, formValues.email, formValues.defaultLanguage, formValues.role)
          .then(() => {
            observer.next(false);
            this.toastService.showsToastBar(this.translationService.translatePhrase('EDIT.USER.CHANGES_SAVED'), 'success');
            this.formGroup.enable();
            this.userService.getUserInformationById(this.userId).then(user => {
              this.firstUserState = user;
            });
          });
    });
  }

  /**
   * Remove changes.
   */
  cancel() {
    this.user = Object.assign({}, this.firstUserState);
    this.loadForm();
  }

  /**
   * Block account of the user.
   */
  blockAccount() {
    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      this.formGroup.disable();
      this.userService.blockAccount(this.userId)
          .then(() => {
            observer.next(false);
            this.toastService.showsToastBar(this.translationService.translatePhrase('EDIT.USER.ACCOUNT_BLOCKED'), 'success');
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
