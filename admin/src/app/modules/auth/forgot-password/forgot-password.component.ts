import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import {UserService} from '../../../services/user.service';
import {TranslationService} from '../../../services/translation.service';
import { ActivatedRoute, Router } from '@angular/router';


enum ErrorStates {
  NotSubmitted,
  HasError,
  NoError,
}

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  errorState: ErrorStates = ErrorStates.NotSubmitted;
  errorStates = ErrorStates;
  isLoading$: Observable<boolean>;
  hasError: boolean;
  returnUrl: string;
  isLoading: boolean;
  form_loaded: boolean;

  
  error_message:string = "";  //Message string
  
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  constructor(
    private fb: FormBuilder,
    private user: UserService,
    private route: ActivatedRoute,
    private router: Router,    
    private translation: TranslationService,    
    private ref: ChangeDetectorRef
  ) {
    //this.isLoading$ = this.authService.isLoading$;
  }

  ngOnInit(): void {
    this.initForm();
    this.ref.detectChanges();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.forgotPasswordForm.controls;
  }

  initForm() {
    this.forgotPasswordForm = this.fb.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
        ]),
      ],
    });
    this.form_loaded = true;
  }

  async submit() {
    this.errorState = ErrorStates.NotSubmitted;


    this.hasError = false;
    this.isLoading = true;
    console.log("submit restore");
    let r = await this.user.password_reset(this.f.email.value);
    if (r.is_error) {
      console.log("RESTORE ERROR");
      console.log(r.error);
      if (r.error.error) this.error_message = r.error.error;
      if (this.error_message=="") this.error_message = r.error.error;
      if (this.error_message=="") this.error_message = "CONNECTION_ERROR";
      this.hasError = true;
      this.isLoading = false;

    } else {
      console.log("RESTORE OK");
      //console.log(r);
      this.error_message = "";
      this.hasError= false;
      this.isLoading = true;
      this.router.navigate(['/auth/login/'+r.message]);
    }
    this.ref.detectChanges();

 
  }


  public translate(phrase:string) {
    let r = this.translation.translatePhrase(phrase);
    return r;
  }
}
function ngOnDestroy() {
  throw new Error('Function not implemented.');
}

