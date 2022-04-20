import {Component, OnInit, OnDestroy, ChangeDetectorRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription, Observable} from 'rxjs';
import {first} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../services/user.service';
import {TranslationService} from '../../../services/translation.service';
import {ApplicationService} from '../../../services/application.service';
import {GoogleLoginProvider, SocialAuthService} from 'angularx-social-login';
import {ConfigService} from '../../../services/config.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
    // KeenThemes mock, change it to:
    // defaultAuth = {
    //   email: '',
    //   password: '',
    // };
    defaultAuth: any = {
        email: '',
        password: '',
    };
    loginForm: FormGroup;
    hasError: boolean;
    returnUrl: string;
    isLoading$: Observable<boolean>;
    isLoading: boolean;

    form_created: boolean = false;

    google_registration = false;


    error_message: string = '';  //Message string
    success_message: string = '';  //Message string

    // private fields
    private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private user: UserService,
        private configService: ConfigService,
        private translation: TranslationService,
        private ref: ChangeDetectorRef,
        private applicationService: ApplicationService,
        private socialAuthService: SocialAuthService
    ) {
        //this.isLoading$ = this.authService.isLoading$;

        if (this.user.is_logined()) this.router.navigate(['/']);
    }

    async ngOnInit(): Promise<void> {

        let config:any = await this.configService.getConfig();
        this.google_registration = config.google_registration;

        this.initForm();
        this.ref.detectChanges();

        this.route.params.subscribe((params: any) => {
            console.log('refer ' + params['refer']);
            if (params['refer']) {
                if (params['refer'] == 'SESSION_EXPIRED') {
                    this.error_message = 'SESSION_EXPIRED';
                    this.hasError = true;
                } else {
                    this.success_message = params['refer'];
                    this.hasError = true;
                }
                //this.success_message = params['refer'];
                //this.hasError= false;
            }
        });

        // get return url from route parameters or default to '/'
        this.returnUrl =
            this.route.snapshot.queryParams['returnUrl'.toString()] || '/';
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.loginForm.controls;
    }

    initForm() {
        this.loginForm = this.fb.group({
            email: [
                this.defaultAuth.email,
                Validators.compose([
                    Validators.required,
                    Validators.email,
                    Validators.minLength(3),
                    Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
                ]),
            ],
            password: [
                this.defaultAuth.password,
                Validators.compose([
                    Validators.required,
                    Validators.minLength(5),
                    Validators.maxLength(100),
                ]),
            ],
        });
        this.form_created = true;
    }

    async submit() {
        this.isLoading = true;
        this.hasError = false;
        console.log('submit login');
        let r = await this.user.do_login(this.f.email.value, this.f.password.value);
        if (r.is_error) {
            console.log('LOGIN ERROR');
            console.log(r.error);
            if (r.error.error) this.error_message = r.error.error;
            if (this.error_message == '') this.error_message = r.error.error;
            if (this.error_message == '') this.error_message = 'CONNECTION_ERROR';
            this.hasError = true;
            this.isLoading = false;
        } else {
            console.log('LOGIN OK', r);
            this.error_message = '';
            this.hasError = false;
            this.router.navigate(['/dashboard']);
        }
        this.ref.detectChanges();
    }

    ngOnDestroy() {
        this.unsubscribe.forEach((sb) => sb.unsubscribe());
        this.isLoading = false;
        console.log('isLoading End. and isLoading:' + this.isLoading);
    }


    public translate(phrase: string) {
        let r = this.translation.translatePhrase(phrase);
        return r;
    }

    /**
     * Login from google.
     */
    loginWithGoogle() {
        this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then((user) => {
            this.user.googleLogin(user.email, user.name, user.idToken).then(response => {
                console.log(response);
                if (!response.is_error) {
                    if (response.user.user_type_id == 2) {
                        this.applicationService.loadUserApplications().then(response => {
                            if (response.length < 1) {
                                this.router.navigate(['/create_app']);
                            } else {
                                this.router.navigate(['/dashboard-customer']);
                            }
                        });
                    } else {
                        this.router.navigate(['/dashboard']);
                    }
                }
            }).catch (err => {
                console.log("Google login уerror");
                console.log(err);
            });
        }).catch (err => {
            console.log("Google login error");
            console.log(err);
        })
    }
}
