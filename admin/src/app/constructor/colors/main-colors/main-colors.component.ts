import { Component, OnInit, ElementRef, HostListener, ChangeDetectorRef, } from '@angular/core';
import { SubheaderService } from '../../ConstructorComponents/subheader/_services/subheader.service';
import {Observable, Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {ApplicationService} from '../../../services/application.service'
import { ActivatedRoute, Router } from '@angular/router';
import {TranslationService} from "../../../services/translation.service";
import {ToastService} from '../../../platform/framework/core/services/toast.service';
import {environment} from "../../../../environments/environment";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-main-colors',
  templateUrl: './main-colors.component.html',
  styleUrls: ['./main-colors.component.scss']
})
export class MainColorsComponent implements OnInit {

  isLoading$: Observable<boolean>;
  was_changed: boolean = false;
  inside: boolean = false;
  app_id: number;
  application: any;


  displayColorPicker: boolean = false;
  show_fore_picker: boolean = false;
  show_bg_picker: boolean = false;
  originalImage: any;

  fore_color:string = "#000";
  bg_color:string = "#fff";
  formGroup: FormGroup;
  newImage: any;
  inputText: any;
  isLoadNewImage = false;

  public background_mode:string = "";
  public background_size:string = "";

  constructor(private changeDetectorRef: ChangeDetectorRef , private fb: FormBuilder, private translationService: TranslationService, private router: Router, private toastService: ToastService, private activateRoute: ActivatedRoute, private subheader: SubheaderService, private eRef: ElementRef, private applicationService:ApplicationService ) {


  }

  ngOnInit(): void {
    this.app_id = Number(this.router.url.match(/constructor\/(\d+)/)[1]);
    setTimeout(() => {
      this.subheader.setTitle('CONSTRUCTOR.COLORS.MAIN_COLORS');
      this.subheader.setBreadcrumbs([{
        title: 'CONSTRUCTOR.COLORS.TITLE',
        linkText: 'CONSTRUCTOR.COLORS.TITLE',
        linkPath: 'constructor/'+this.app_id+'/colors/'
      }]);
    }, 1);

    this.app_id = Number(this.router.url.match(/constructor\/(\d+)/)[1]);



    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      this.applicationService.getApplicationColors(this.app_id).then(data=>{
        console.log("colors");
        console.log(data.colors);
        this.fore_color = data.colors['--ion-text-color'].color_value;
        this.bg_color = data.colors['--ion-background-color'].color_value;

        this.applicationService.getApplicationById(this.app_id).then(response => {
          if (!response.is_error) {
            this.application = response;
            if (!this.application.background_image || this.application.background_image=="") {
              this.originalImage = "";
            } else {
              this.originalImage = environment.apiUrl + "storage/application/" + this.application.id + "-" + this.application.unique_string_id + '/resources/' + this.application.background_image;
            }
          }
          this.loadForm();
          observer.next(false);
        });

      }).finally( ()=>{
        //observer.next(false);
      });
    });

  }    

    /**
   * Init formGroup.
   */
     loadForm() {
      this.formGroup = this.fb.group({
        inputImage: new FormControl('')
      });
    }

  /**
   * Store fore color and background color to core
   */
  save() {
    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      
      let colors = [
        {color_name: '--ion-text-color', named:"", color_value: this.fore_color},
        {color_name: '--ion-background-color', named:"", color_value: this.bg_color},
      ]

      let bg = this.application.background_image;
      if (bg == null || !bg) bg = "-";

      let background_mode = { 
        background_image_size: this.application.background_image_size,
        background_image_mode: this.application.background_image_mode,
        background_image: bg,
      };

      this.applicationService.setApplicationColors(this.app_id, colors, background_mode).then( (response) =>{
        if (response.is_error) {
          this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_NOT_SAVED'), 'warning');
          this.applicationService.createMokupEvent("need_rebuild",{});
        } else {
          this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_SAVED'), 'success');
          this.was_changed = false;
        }
      }).catch (err =>{
        this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_NOT_SAVED'), 'warning');
      })
      .finally( ()=>{
        observer.next(false);
      });

    });
  }

  /**
   * restore colors value from server
   */
  cancel() {
    this.was_changed = false;
    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      this.applicationService.getApplicationColors(this.app_id).then(data=>{
        console.log("colors");
        console.log(data.colors);
        this.fore_color = data.colors['--ion-text-color'].color_value;
        this.bg_color = data.colors['--ion-background-color'].color_value;
        this.application.colors['--ion-text-color'].color_value = this.fore_color;
        this.application.colors['--ion-background-color'].color_value = this.bg_color;
        this.callChangeEvent();
      }).finally( ()=>{
        observer.next(false);
      });
    });
  }

  /**
   * Change textcolor event
   * @param event Event from colorpicke component
   */
  changeForeColor(event:any) {
    //console.log(event);
    this.fore_color = event.hex;
    this.was_changed = true;
    this.application.colors['--ion-text-color'].color_value = event.hex;
    this.callChangeEvent();    
  }


  /**
   * Change bg color event
   * @param event Event from colorpicke component
   */
  changeBgColor(event:any) {
   //console.log(event);
    this.bg_color = event.hex;
    this.was_changed = true;
    this.application.colors['--ion-background-color'].color_value = event.hex;
    this.callChangeEvent();
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
        this.application.background_image = this.newImage;
        this.inputText = (<HTMLInputElement>document.getElementById('inputImage')).files[0].name;

        this.isLoadNewImage = true;
        this.was_changed = true;
        this.changeDetectorRef.detectChanges();
        this.applicationService.createMokupEvent("changeEvent",this.application);
      }
      fr.readAsDataURL(icon);
    }
  } 
  
  /**
   * call change event for update mokup
   */
  callChangeEvent() {
    this.applicationService.createMokupEvent("changeEvent",this.application);
  }


  deleteBgImage() {
    this.application.background_image = "";
    this.originalImage = "";
    this.isLoadNewImage = false;
    this.was_changed = true;
    this.applicationService.createMokupEvent("changeEvent",this.application);
  }

}
