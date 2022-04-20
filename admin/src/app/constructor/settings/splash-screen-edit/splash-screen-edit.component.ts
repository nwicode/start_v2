import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ApplicationService} from "../../../services/application.service";
import {TranslationService} from "../../../services/translation.service";
import {ToastService} from "../../../platform/framework/core/services/toast.service";
import {Router} from "@angular/router";
import {environment} from "../../../../environments/environment";
import { SubheaderService } from '../../ConstructorComponents/subheader/_services/subheader.service';
import {HttpClient} from "@angular/common/http";
import {NumberValidator} from "../../../validators/number.validator";

@Component({
  selector: 'app-splash-screen-edit',
  templateUrl: './splash-screen-edit.component.html',
  styleUrls: ['./splash-screen-edit.component.scss']
})
export class SplashScreenEditComponent implements OnInit {

  isLoading$: Observable<boolean>;
  formGroup: FormGroup;

  application: any;
  applicationId: number;
  originalImage: any;
  newImage: any;
  inputText: string;
  isLoadNewImage = false;
  noCacheString = '?nocache=' + Date.now();

  displayBackgroundColorPicker: boolean = false;
  originalBackgroundColorValue: string = "#FFFFFF";
  newBackgroundColorValue: string = "#FFFFFF";

  showSpinner: boolean = true;
  displaySpinnerColorPicker: boolean = false;
  originalSpinnerColorValue: string = "#FFFFFF";
  newSpinnerColorValue: string = "#FFFFFF";
  timeout: number = 0;

  constructor(private applicationService: ApplicationService, private translationService: TranslationService, private subheader: SubheaderService,
              private toastService: ToastService, private fb: FormBuilder, private router: Router, private changeDetectorRef: ChangeDetectorRef, private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.applicationId = Number(this.router.url.match(/constructor\/(\d+)/)[1]);

    setTimeout(() => {
      this.subheader.setTitle('CONSTRUCTOR.EDIT_SPLASHSCREEN.TITLE');
      this.subheader.setBreadcrumbs([{
        title: 'CONSTRUCTOR.SETTINGS.TITLE',
        linkText: 'CONSTRUCTOR.SETTINGS.TITLE',
        linkPath: '/constructor/' + this.applicationId + '/settings'
      }]);
    }, 1);

    this.isLoading$ = new Observable<boolean>( observer => {
      observer.next(true);

      this.applicationService.getApplicationById(this.applicationId).then(response => {
        if (!response.is_error) {
          this.application = response;

          this.originalBackgroundColorValue = response.splashscreen_background_color;
          this.newBackgroundColorValue = response.splashscreen_background_color;

          this.showSpinner = response.splashscreen_show_spinner;
          this.originalSpinnerColorValue = response.splashscreen_spinner_color;
          this.newSpinnerColorValue = response.splashscreen_spinner_color;

          this.timeout = response.splashscreen_timeout;

          this.originalImage = environment.apiUrl + "storage/application/" + this.application.id + "-" + this.application.unique_string_id + '/resources/splash.png';

          this.loadForm();
          observer.next(false);
        }
      });
    });
  }

  /**
   * Init formGroup.
   */
  loadForm() {
    this.formGroup = this.fb.group({
      inputImage: new FormControl(''),
      showSpinner: new FormControl(this.showSpinner),
      timeout: new FormControl(this.timeout, [NumberValidator.checkPositive])
    });
  }

  /**
   * Save new splash screen.
   */
  save() {
    this.formGroup.markAllAsTouched();
    if (!this.formGroup.valid) {
      return;
    }

    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      this.formGroup.disable();
      this.applicationService.updateApplicationSplashScreen(this.applicationId, this.newImage, this.newBackgroundColorValue, this.formGroup.value['showSpinner'], this.newSpinnerColorValue, this.formGroup.value['timeout']).then(response => {
        if (response.is_error) {
          if (response.error.error == "BAD_PNG") {
            this.toastService.showsToastBar(this.translationService.translatePhrase("CONSTRUCTOR.EDIT_SPLASHSCREEN.BAD_PNG"), 'danger');
          } else {
            this.toastService.showsToastBar(this.translationService.translatePhrase("GENERAL.LANGUAGES.CHANGES_NOT_SAVED"), 'danger');
          }
        } else {
          this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_SAVED'), 'success');
          this.originalImage = this.newImage;
          this.originalBackgroundColorValue = this.newBackgroundColorValue;
          this.showSpinner = this.formGroup.value['showSpinner'];
          this.timeout = this.formGroup.value['timeout'];
          this.isLoadNewImage = false;
        }
      })
      .finally(() => {
        this.formGroup.enable();
        observer.next(false);
      });
    });
  }

  /**
   * Remove changes.
   */
  cancel() {
    this.isLoading$ = new Observable<boolean>( observer => {
      observer.next(true);

      this.loadForm();
      this.inputText = '';
      this.isLoadNewImage = false;
      this.newBackgroundColorValue = this.originalBackgroundColorValue;
      this.newSpinnerColorValue = this.originalSpinnerColorValue;
      observer.next(false);
    });
  }

  /**
   * Get name and image after inputImage change.
   */
  onLoadImage() {
    let icon = (<HTMLInputElement>document.getElementById("inputImage")).files[0];

    if (icon) {
      let fr = new FileReader();
      fr.onload = () => {
        this.newImage = fr.result;
        this.inputText = (<HTMLInputElement>document.getElementById('inputImage')).files[0].name;

        this.isLoadNewImage = true;
        this.changeDetectorRef.detectChanges();
      }
      fr.readAsDataURL(icon);
    }
  }

  /**
   * Change color in colorpicker event
   * @param event change color event data from color picker
   */
  changeColorEvent(event:any) {
    if (this.displayBackgroundColorPicker) {
      this.newBackgroundColorValue = event.hex;
    }

    if (this.displaySpinnerColorPicker) {
      this.newSpinnerColorValue = event.hex;
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

}
