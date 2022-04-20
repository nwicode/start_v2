import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import KTWizard from '../../../../assets/js/components/wizard';
import { KTUtil } from '../../../../assets/js/components/util';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ApplicationService} from "../../../services/application.service";
import {SubheaderService} from "../../LayoutsComponents/subheader/_services/subheader.service";
import {ToastService} from "../../framework/core/services/toast.service";
import {TranslationService} from "../../../services/translation.service";
import {EmojiValidator} from "../../../validators/emoji.validator";
import {Router} from "@angular/router";

@Component({
  selector: 'app-create-app',
  templateUrl: './create-app.component.html',
  styleUrls: ['./create-app.component.scss']
})
export class CreateAppComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('wizard', { static: true }) el: ElementRef;

  icon_base64: any;
  name: string;
  description: string;

  default_icon = '/assets/images/app_icon_default.png';
  inputText = 'default_icon.png';
  displayColorPicker: boolean = false;
  colorValue: string = "#FFFFFF";

  templates: any = [];

  wizard: any;
  page = 1;
  formGroup1: FormGroup;

  constructor(private appService: ApplicationService, private subheader: SubheaderService, private toastService: ToastService, private translationService: TranslationService, private router: Router, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.subheader.setTitle('CREATE.APP.SECTION_HEADER');
      this.subheader.setBreadcrumbs([{
        title: 'CREATE.APP.SECTION_HEADER',
        linkText: 'CREATE.APP.SECTION_HEADER',
        linkPath: '/create_app'
      }]);
    }, 1);

    this.convertToBase64(this.default_icon);

    this.formGroup1 = new FormGroup({
      inputIcon: new FormControl(''),
      appName: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30),
        EmojiValidator.checkEmoji
      ]),
      description: new FormControl('', [
          Validators.minLength(4),
          Validators.required
      ])
    });

    this.appService.getApplicationTemplateList().then(response => {
      this.templates = response.templates;
    });
  }

  ngAfterViewInit(): void {
    // Initialize form wizard
    this.wizard = new KTWizard(this.el.nativeElement, {
      startStep: 1, // initial active step number
      clickableSteps: false, // allow step clicking
      navigation: false // disable default navigation handlers,
    });

    let prevButton = this.el.nativeElement.querySelector('[data-wizard-type="action-prev"]');
    let nextButton = this.el.nativeElement.querySelector('[data-wizard-type="action-next"]');

    // Custom navigation handlers
    prevButton.addEventListener('click', () => {
      this.page--;
      this.wizard.goPrev();
    });

    nextButton.addEventListener('click', () => {
      let validation = false;
      let page = this.wizard.getStep();

      switch (page) {
        case 1: {
          validation = this.formGroup1.valid;
          break;
        }
        case 2: {
          validation = true;
          break;
        }
      }
      // Go to the next step only if validation is success
      if (validation === true) {
        this.wizard.goNext();
        this.page++;
      }
    });


    // Change event
    this.wizard.on('changed', () => {
      setTimeout(() => {
        KTUtil.scrollTop();
      }, 500);
    });
  }

  onSubmit() {
    this.appService.createApplication(this.name, this.description, this.icon_base64, this.colorValue)
        .then(response => {
          if (response.is_error) {
            let toastText;
            switch (response.error.error) {
              case "CONTAINS_SPAM_WORD_IN_NAME": {
                toastText = "CREATE.APP." + response.error.error;
                break;
              }
              case "DUPLICATE_NAME": {
                toastText = "CREATE.APP." + response.error.error;
                break;
              }
              case "BAD_PNG": {
                toastText = "CREATE.APP." + response.error.error;
                break;
              }
              default: {
                toastText = "CREATE.APP.INCORRECT_DATA";
              }
            }

            this.toastService.showsToastBar(this.translationService.translatePhrase(toastText), 'danger');

            this.page = 1;
            this.wizard.goTo(1);
          } else {
            this.toastService.showsToastBar(this.translationService.translatePhrase('CREATE.APP.APPLICATION_CREATED'), 'success');
            let app_id = response.id;
            setTimeout(() => {
              this.router.navigate([`/constructor/${app_id}`]);
            }, 4000);
          }
        });
  }

  ngOnDestroy() {
    this.wizard = undefined;
  }

  /**
   * Get name and image after inputIcon change.
   */
  onLoadImage() {
    let icon = (<HTMLInputElement>document.getElementById("inputIcon")).files[0];

    if (icon) {
      let fr = new FileReader();
      fr.onload = () => {
        this.icon_base64 = fr.result;
        this.inputText = (<HTMLInputElement>document.getElementById('inputIcon')).files[0].name;

        this.changeDetectorRef.detectChanges();
      }
      fr.readAsDataURL(icon);
    }
  }

  /**
   * Convert image to base64 string
   *
   * @param imgPath image path
   * @return base64 string
   */
  convertToBase64(imgPath: string) {
    var xhr = new XMLHttpRequest();
    xhr.onload = () => {
      var reader = new FileReader();
      reader.onloadend = () => {
        this.icon_base64 = reader.result;
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', imgPath);
    xhr.responseType = 'blob';
    xhr.send();
  }

  /**
   * Change color in colorpicker event
   * @param event change color event data from color picker
   */
  changeColorEvent(event:any) {
    this.colorValue = event.hex;
  }
}
