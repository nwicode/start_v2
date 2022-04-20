import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { LayoutService} from '../../../services/layout.service';
import {ToastService} from '../../../platform/framework/core/services/toast.service';
import {TranslationService} from "../../../services/translation.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-page-settings-form',
  templateUrl: './page-settings-form.component.html',
  styleUrls: ['./page-settings-form.component.scss']
})
export class PageSettingsFormComponent implements OnInit {

  @Input('page_id') public page_id:number;
  @Input('page_name') public page_name:string;
  @Output() close: EventEmitter<any> = new EventEmitter();

  colorPickerModal:NgbModalRef;
  private app_id:number;
  formGroup: FormGroup;

  //object wuth all form settings
  public page_settings:any = {};
  public data_loaded:boolean = false;
  public color_defined:boolean = false;
  public new_color_name:string = "";
  public new_color_value:string = "";

  public selected_active_background_color: string = "";

  public state: string = "";
  public selectedBackgroundImage: string = "default";
  public background_image_settings: string = "default";
  newImage: any;
  inputText: any;
  isLoadNewImage = false;

  //Selected animation here
  public selectedAnimation:any = {};

  constructor(private changeDetectorRef: ChangeDetectorRef , private fb: FormBuilder, private translationService: TranslationService,  private modalService: NgbModal, private router: Router, private layoutService:LayoutService,private ref: ChangeDetectorRef, private toastService: ToastService, ) { }

  ngOnInit(): void {
    this.app_id = Number(this.router.url.match(/constructor\/(\d+)/)[1]);
    this.loadForm();
  }

  /**
   * Change background image
   */
  changeBackgroundImage() {
    this.background_image_settings = this.selectedBackgroundImage;
    this.page_settings.background_image_settings = this.background_image_settings;
    console.log(this.background_image_settings);
    console.log(this.page_settings);
    if (this.background_image_settings=="none") {this.page_settings.page.background_image = "";}
    else if (this.background_image_settings=="default") {
      this.page_settings.page.background_image = this.page_settings.default_background_mode.background_image;
      this.page_settings.page.background_image_mode = this.page_settings.default_background_mode.background_image_mode;
      this.page_settings.page.background_image_size = this.page_settings.default_background_mode.background_image_size;
    } else if (this.background_image_settings=="custom") {

    }
    this.layoutService.createActionEvent("pageModifiedBySettings", {page_id: this.page_id, page_settings:this.page_settings});  
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
        this.page_settings.page.background_image = this.newImage;
        this.inputText = (<HTMLInputElement>document.getElementById('inputImage')).files[0].name;

        this.isLoadNewImage = true;
        this.changeDetectorRef.detectChanges();
        this.layoutService.createActionEvent("pageModifiedBySettings", {page_id: this.page_id, page_settings:this.page_settings}); 
      }
      fr.readAsDataURL(icon);
    }
  }

  /**
 * Init formGroup for upload background image.
 */
    loadForm() {
    this.formGroup = this.fb.group({
      inputImage: new FormControl('')
    });
  }

  ngOnChanges(): void {
    this.page_settings = {};
    this.data_loaded = false;
    if (!this.page_id) return;
    this.layoutService.getPageData(this.app_id,this.page_id).then( response=>{
      this.applyLoadedSettingsToForm(response);
      this.ref.detectChanges();
    });
  }

  /**
   * apply loaded settings to form
   * @param settings loaded settings from core controller
   */
  applyLoadedSettingsToForm(settings:any) {
    this.page_settings = settings;
    this.data_loaded = true;
    console.log("getPageData");
    console.log(settings);

    //set background image mode
    // if page bacground == default background - det value to default
    /*if (this.page_settings.page.background_image==this.page_settings.default_background_mode.background_image) {
      this.selectedBackgroundImage = "default";
    } else if (this.page_settings.page.background_image!=this.page_settings.default_background_mode.background_image && this.page_settings.page.background_image!=""  && this.page_settings.page.background_image!="none") {
      this.selectedBackgroundImage = "custom";
    } else if (this.page_settings.page.background_image=="none") {
      this.selectedBackgroundImage = "none";
    }*/
    if (this.page_settings.page.background_image=='none') {
      this.selectedBackgroundImage = "none";
      this.background_image_settings = "none";
    } else if (this.page_settings.page.background_image=='default') {
      this.background_image_settings = "default";
      this.selectedBackgroundImage = "default";
      this.page_settings.page.background_image = this.page_settings.default_background_mode.background_image;
      this.page_settings.page.background_image_mode = this.page_settings.default_background_mode.background_image_mode;
      this.page_settings.page.background_image_size = this.page_settings.default_background_mode.background_image_size;      
    } else {
      //nothing to do
      this.selectedBackgroundImage = "custom";
    }

    
    // start page animation (if exists)
    this.selectedAnimation = {};
    this.selectedAnimation.id = 0;
    /*if (this.page_settings.page.current_animation!=0) {

       this.page_settings.page.start_animations.forEach(element => {
         if (element.id==this.page_settings.page.current_animation) {
           this.selectedAnimation = element;
           this.page_settings.selectedAnimation = this.selectedAnimation;
           this.startAnimationChanged();
           //console.log("asdsadasdsadsad");
           //console.log(this.selectedAnimation);
         }
       });
       
    }*/

    this.onAnimationChange(this.page_settings.page.current_animation);
    this.ref.detectChanges();
    console.log("this.page_settings.page");
    console.log(this.page_settings.page);

  }

  /**
   * set bacground color in page settgins
   * @param color clicked color
   */
  setBackgroundColor(color:any) {
    this.page_settings.page.background = color.color_name;
    this.selected_active_background_color = color.color_name;

    //call page change event for preview
    let new_page_settings = Object.assign({}, this.page_settings);
    //call page settings event 
    this.layoutService.createActionEvent("pageModifiedBySettings", {page_id: this.page_id, page_settings:new_page_settings});    
  }


  /**
 * Run close panel event
 */
  public closeForm() {
    this.layoutService.createActionEvent("pageNeedToRestore", {page_id: this.page_id});
    this.close.emit({});
  }

  openColorPickerModal(content) {
    this.new_color_name = "Background "+ (Math.floor(Math.random() * (99999 - 1000 + 1)) + 1000).toString();
    this.colorPickerModal = this.modalService.open(content, {
        size: 'sm',
        modalDialogClass: 'color-picker-modal'
    });
  }

  /**
   * Close color picker dialog and add color to user colors
   */
  closeAndSaveColorPickerModal() {
    this.colorPickerModal.close();
    let color_id = (Math.floor(Math.random() * (99999 - 1000 + 1)) + 1000).toString();
    let new_color = Object.assign({}, this.page_settings.colors_system[0]);
    new_color.name = this.new_color_name;
    new_color.color_value = this.new_color_value;
    new_color.color_name = "--ion-color-background"+color_id;
    new_color.new = true;
    new_color.color_type = "user";
    new_color.named = "background"+color_id; //named required
    new_color.disabled = false;
    new_color.letter = "";
    new_color.id = 0;
    this.page_settings.colors_user.push(new_color);
    this.page_settings.page.background = new_color.color_name;
  }


  /**
   * Close bg colorpicker dialog and restore pagesettigns in page-card
   */
  closeColorPickerModalAndCancelSettings() {
    this.page_settings.page.background = this.selected_active_background_color;
    this.colorPickerModal.close();
    let new_page_settings = Object.assign({}, this.page_settings);
    this.layoutService.createActionEvent("pageModifiedBySettings", {page_id: this.page_id, page_settings:new_page_settings});
  }

  /**
   * event on change color in colorpicker
   * @param ev event from image color picker
   */
  changeBgColorEvent(ev:any) {
    this.new_color_value = ev.hex;
    
    //copy page settigns and replace bg color
    let new_page_settings = Object.assign({}, this.page_settings);
    //call page settings event 
    new_page_settings.page.background = this.new_color_value;
    this.layoutService.createActionEvent("pageModifiedBySettings", {page_id: this.page_id, page_settings:new_page_settings});
  }


  /**
   * validate page settgins fields before save
   * @returns true or false
   */
  validateSettings() {
    let result = true;
    if (this.data_loaded) {
      if (this.page_settings.page.name=='') result = false;
    } else result = false;
    return result;
  }

  /**
   * Store page settings on core side
   */
  savePageSettings() {
    console.log(this.page_settings);
    this.layoutService.setPageData(this.app_id, this.page_id, this.page_settings).then( response=> {
      if (response.is_error) {
        this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_NOT_SAVED'), 'warning');
      } else {
        this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_SAVED'), 'success');
      }
      this.layoutService.createActionEvent("pageNeedToRestore", {page_id: this.page_id});
    });

    this.close.emit({});
  }


  /**
   * Change start animation
   */

   onAnimationChange(animation_id:any) {
     this.selectedAnimation = {};
     this.selectedAnimation.id = 0;
     if (animation_id!=0) {

        this.page_settings.page.start_animations.forEach(element => {
          if (element.id==animation_id) {
            this.selectedAnimation = element;
            this.page_settings.selectedAnimation = this.selectedAnimation;
            this.startAnimationChanged();
          }
        });
        
     } else {
      this.selectedAnimation = {
        id:0,
        html: this.page_settings.page.custom_app_animation_html,
        css: this.page_settings.page.custom_app_animation_css,
       }
       this.page_settings.selectedAnimation = this.selectedAnimation;
       this.startAnimationChanged();
     }
     //console.log(this.selectedAnimation);
   }


   /**
    * Fired if start page animation changed
    */
  startAnimationChanged() {
    //console.log("startAnimationChanged fired:")
    //console.log(this.selectedAnimation);
    let generated_html:any  = "";
    if (this.selectedAnimation.html !== undefined) generated_html = this.selectedAnimation.html;
    generated_html = generated_html.replaceAll("{{color1}}",this.selectedAnimation.color1);
    generated_html = generated_html.replaceAll("{{color2}}",this.selectedAnimation.color2);
    generated_html = generated_html.replaceAll("{{color3}}",this.selectedAnimation.color3);
    generated_html = generated_html.replaceAll("{{color4}}",this.selectedAnimation.color4);
    generated_html = generated_html.replaceAll("{{color5}}",this.selectedAnimation.color5);
    generated_html = generated_html.replaceAll("{{START_LOADING_TEXT}}","Loading..");

    let generated_css:any ="";
    if (this.selectedAnimation.css !== undefined)  generated_css = this.selectedAnimation.css;
    generated_css = generated_css.replaceAll("{{color1}}",this.selectedAnimation.color1);
    generated_css = generated_css.replaceAll("{{color2}}",this.selectedAnimation.color2);
    generated_css = generated_css.replaceAll("{{color3}}",this.selectedAnimation.color3);
    generated_css = generated_css.replaceAll("{{color4}}",this.selectedAnimation.color4);
    generated_css = generated_css.replaceAll("{{color5}}",this.selectedAnimation.color5);

    //add this to page data and call page update
    let new_page_settings = Object.assign({}, this.page_settings);
    if (new_page_settings.page.generated_html !== undefined) new_page_settings.page.generated_html = generated_html;
    if (new_page_settings.page.generated_css !== undefined) new_page_settings.page.generated_css = generated_css;
    this.layoutService.createActionEvent("pageModifiedBySettings", {page_id: this.page_id, page_settings:new_page_settings});
  }

  
  replaceAll(str:string, find:string, replace:string) {
    return str.replace(new RegExp(find, 'g'), replace);
  }

}
