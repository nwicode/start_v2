import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {TranslationService} from "../../../services/translation.service";
import {ToastService} from "../../../platform/framework/core/services/toast.service";
import {ApplicationService} from "../../../services/application.service";
import {Router} from "@angular/router";
import {environment} from "../../../../environments/environment";
import { SubheaderService } from '../../ConstructorComponents/subheader/_services/subheader.service';

@Component({
  selector: 'app-icon-edit',
  templateUrl: './icon-edit.component.html',
  styleUrls: ['./icon-edit.component.scss']
})
export class IconEditComponent implements OnInit {

  isLoading$: Observable<boolean>;
  formGroup: FormGroup;

  application: any;
  applicationId: number;
  originalIcon: any;
  newIcon: any;
  inputText: string;
  isLoadNewImage = false;
  noCacheString = '?nocache=' + Date.now();

  displayColorPicker: boolean = false;
  originalColorValue: string = "#FFFFFF";
  newColorValue: string = "#FFFFFF";

  constructor(private applicationService: ApplicationService, private translationService: TranslationService, private subheader: SubheaderService,
              private toastService: ToastService, private fb: FormBuilder, private router: Router, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.applicationId = Number(this.router.url.match(/constructor\/(\d+)/)[1]);

    setTimeout(() => {
      this.subheader.setTitle('CONSTRUCTOR.EDIT_ICON.TITLE');
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
          this.originalColorValue = response.icon_background_color;
          this.newColorValue = response.icon_background_color;
          this.originalIcon = environment.apiUrl + "storage/application/" + this.application.id + "-" + this.application.unique_string_id + '/resources/icon.png';

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
      inputIcon: new FormControl('')
    });
  }

  /**
   * Save new icon.
   */
  save() {
    this.formGroup.markAllAsTouched();
    if (!this.formGroup.valid) {
      return;
    }

    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      this.formGroup.disable();

      this.applicationService.updateApplicationIcon(this.applicationId, this.newIcon, this.newColorValue).then(response => {
        if (response.is_error) {
          if (response.error.error == "BAD_PNG") {
            this.toastService.showsToastBar(this.translationService.translatePhrase("CONSTRUCTOR.EDIT_ICON.BAD_PNG"), 'danger');
          } else {
            this.toastService.showsToastBar(this.translationService.translatePhrase("GENERAL.LANGUAGES.CHANGES_NOT_SAVED"), 'danger');
          }
        } else {
          this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_SAVED'), 'success');
          this.originalIcon = this.newIcon;
          this.originalColorValue = this.newColorValue;
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
      this.newColorValue = this.originalColorValue;
      observer.next(false);
    });
  }

  /**
   * Get name and image after inputIcon change.
   */
  onLoadImage() {
    let icon = (<HTMLInputElement>document.getElementById("inputIcon")).files[0];

    if (icon) {
      let fr = new FileReader();
      fr.onload = () => {
        this.newIcon = fr.result;
        this.inputText = (<HTMLInputElement>document.getElementById('inputIcon')).files[0].name;

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
    this.newColorValue = event.hex;
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
