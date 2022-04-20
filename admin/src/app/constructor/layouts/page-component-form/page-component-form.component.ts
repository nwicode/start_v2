import { Component, OnInit, ElementRef, Renderer2, ViewChild, ChangeDetectorRef } from '@angular/core';
import { LayoutService} from '../../../services/layout.service';
import {DomSanitizer} from '@angular/platform-browser';
import { Router } from '@angular/router';
import {ColorDialogService} from '../../ConstructorComponents/color-dialog/color-dialog.service';
import {ScriptService} from '../../../services/script.service';
import {StringDialogService} from '../../ConstructorComponents/string-dialog/string-dialog.service';
import {TextDialogService} from "../../ConstructorComponents/text-dialog/text-dialog.service";
import {VisibilityDialogService} from "../../ConstructorComponents/visibility-dialog/visibility-dialog.service";
import {ContentDialogService} from "../../ConstructorComponents/content-dialog/content-dialog.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {GalleryDialog} from "../../ConstructorComponents/gallery-dialog/gallery-dialog.objects";
import {GalleryDialogComponent} from "../../ConstructorComponents/gallery-dialog/gallery-dialog.component";
import {ApplicationService} from "../../../services/application.service";
import {FormControl, FormGroup} from "@angular/forms";

//this methods call from extern form_js
declare function component_data_changed(form_data:any,component_data:any, page_data:any): any;
declare function component_init_form(form_data:any,component_data:any, page_data:any): any;

declare function color_selected(element:any,result:any): any;
declare function icon_selected(element:any,result:any): any;
declare function strings_inputted(element:any,result:any): any;
declare function texts_inputted(element:any,result:any): any;
declare function visibility_inputted(element:any,result:any): any;
declare function content_inputted(element:any,result:any): any;
declare function gallery_inputted(element:any,result:any): any;


declare var $: any;

@Component({
  selector: 'app-page-component-form',
  templateUrl: './page-component-form.component.html',
  styleUrls: ['./page-component-form.component.scss']
})
export class PageComponentFormComponent implements OnInit {

  closeResult:string = "";
  form: any = {};
  form_tabs: any = [];
  form_data: any = {};
  page: any = {};
  component: any = {};
  app_id: number;
  was_changed: boolean =  false;
  is_saving: boolean =  false;

  selectedTab = 0;
  visibility_list: any;
  visibility_list_or: any;
  visibility_list_and: any;
  variables_list: any;
  formGroupOR: any;
  formGroupAND: any;  
  
  card_background_color_value: string = "";
  card_background_color_value_wo_alfa: string = "";
  card_border_color_value: string = "";
  card_border_color_value_wo_alfa: string = "";
  has_card_design: boolean = false;


  constructor(private script: ScriptService, private colorDialog:ColorDialogService, private router: Router, private ref: ChangeDetectorRef, private layoutService:LayoutService, private sanitizer:DomSanitizer, private el:ElementRef, private rendrer: Renderer2, private stringDialog: StringDialogService, private textDialog: TextDialogService, private visibilityDialog: VisibilityDialogService, private contentDialog: ContentDialogService,  public galleryDialog: MatDialog, private appService: ApplicationService) { }



  ngOnInit(): void {

    this.app_id = Number(this.router.url.match(/constructor\/(\d+)/)[1]);

    this.layoutService.onSideActionSubject().subscribe((event:any)=>{
      if (event.event=="openComponentForm") {
        //console.log("page component form");
        console.log(event);
        //console.log(event.data.component.data.form_html);
        this.form = {};
        this.form = this.sanitizer.bypassSecurityTrustHtml(event.data.component.data.form_html);

        //show tabs
        this.form_tabs = [];
        if (event.data.component.data.form_tabs.length>0) {
          event.data.component.data.form_tabs.forEach(tab => {
            this.form_tabs.push({title:this.sanitizer.bypassSecurityTrustHtml(tab.title),html:this.sanitizer.bypassSecurityTrustHtml(tab.html)});
          });
        }
        console.log(this.form_tabs);
        //console.log(event.data.component.data);
        //console.log(this.form_tabs);
        this.page = event.data.page;
        this.component = event.data.component;

        //assign color for card wrapper
        this.component.colors.forEach(color => {  
          if (color.color_name == this.component.card_background_color) this.card_background_color_value = this.addAlpha(color.color_value,this.component.card_opacity);
          if (color.color_name == this.component.card_background_color) this.card_background_color_value_wo_alfa = color.color_value;
          if (color.color_name == this.component.card_border_color) this.card_border_color_value = color.color_value;
        });
        console.log(this.component.data.package_info);
        if (this.component.data.package_info.card_design !== undefined && this.component.data.package_info.card_design) this.has_card_design = true;

        this.visibility_list = this.component.actions_and_variables.visibility_conditions;
        this.visibility_list_and = [];
        this.visibility_list_or = [];
        console.log(this.visibility_list);
        
        console.log("compo data");
        console.log(this.component);
        this.variables_list = this.component.actions_and_variables.variables;


        //create visibility list and assign value
        this.visibility_list.forEach(element => {
          let condition_copy: any = Object.assign({},element);
          let condition_copy1: any = Object.assign({},element);
          condition_copy.selected = false;
          condition_copy1.selected = false;

          //check selected
          if (this.component.visibility !== undefined && this.component.visibility.or !== undefined) this.component.visibility.or.forEach(v => { if (v==condition_copy1.code) condition_copy1.selected = true;});
          if (this.component.visibility !== undefined && this.component.visibility.and !== undefined) this.component.visibility.and.forEach(v => { if (v==condition_copy.code) condition_copy.selected = true;});

          this.visibility_list_and.push(condition_copy);
          this.visibility_list_or.push(condition_copy1);
        });

        //load JS from component
        this.script.reloadJsScript(this.rendrer,this.component.data.form_js,"form_js");

        this.ref.detectChanges();
        this.refreshForm();
        this.createFormData();
        component_init_form(this.form_data,this.component,this.page);

        this.loadForm();
      } else if (event.event=="componentWasMovied") {
        //component was movied or resized - update date
        if (event.data.component_id == this.component.id) {
          this.component.x0 = event.data.left;
          this.component.x = event.data.left;
          this.component.y0 = event.data.top;
          this.component.y = event.data.top;
          this.component.width = event.data.width;
          this.component.height = event.data.height;
        }
      }
    });
  }

  loadForm() {
    let fieldsOR = {};
    let fieldsAND = {};
    for (let i = 0; i < this.visibility_list.length; i++) {
      fieldsOR[this.visibility_list[i]['code']] = new FormControl(false);
      fieldsAND[this.visibility_list[i]['code']] = new FormControl(false);
    }

    this.formGroupOR = new FormGroup(fieldsOR);
    this.formGroupAND = new FormGroup(fieldsAND);
  }


  /**
   * This method called after every input, textarea and other controls change
   */
  changeEvent(t:any) {
    console.log("changeEvent");
    console.log(t);
    this.createFormData();
    component_data_changed(this.form_data,this.component,this.page);

    this.was_changed = true;

    //fire event and reload compoenent from server
    //this.layoutService
  } 


  createFormData() {
    this.form_data = {};
    const form = this.el.nativeElement.querySelector("#component_form");
    const inputs = form.querySelectorAll("input, textarea, select");
    inputs.forEach(element => {
//      console.log("element");
//      console.log(element);
      this.form_data[element.name] = element.value;

      //check attributes and show values, if need id
      if (element.hasAttribute('displayin')) {
        let display_selector = element.attributes['displayin'].value;
        console.log(display_selector);
        if (form.querySelector(display_selector)) form.querySelector(display_selector).innerHTML  = element.value;
      }
    });

    

  }
  /**
   * redraw form
   */
  refreshForm() {
    const form = this.el.nativeElement.querySelector("#component_form");
    const inputs = form.querySelectorAll("input, textarea, select");
    const buttons = form.querySelectorAll("button");
    inputs.forEach(element => {
      element.addEventListener('input', this.changeEvent.bind(this));
    });

    buttons.forEach(element => {
      if (element.hasAttribute('color-dialog')) {
        element.addEventListener('click', (event:Event)=>{
          this.showColorDialog(element);
          event.preventDefault();
        });
      }

      if (element.hasAttribute('icon-dialog')) {
        element.addEventListener('click', (event:Event)=>{
          this.openIoniconDialog(element);
          event.preventDefault();
        });
      }

      if (element.hasAttribute('string-dialog')) {
        element.addEventListener('click', (event:Event)=>{
          this.openStringDialog(element);
          event.preventDefault();
        });
      }

      if (element.hasAttribute('text-dialog')) {
        element.addEventListener('click', (event:Event)=>{
          this.openTextDialog(element);
          event.preventDefault();
        });
      }

      if (element.hasAttribute('visibility-dialog')) {
        element.addEventListener('click', (event:Event)=>{
          this.openVisibilityDialog(element);
          event.preventDefault();
        });
      }

      if (element.hasAttribute('content-dialog')) {
        element.addEventListener('click', (event:Event)=>{
          this.openContentDialog(element);
          event.preventDefault();
        });
      }

      if (element.hasAttribute('gallery-dialog')) {
        element.addEventListener('click', (event:Event)=>{
          this.openGalleryDialog(element);
          event.preventDefault();
        });
      }
    });
    //get all inputs and buttons
    //console.log(form);
    //console.log(inputs);

    const dom: HTMLElement = this.el.nativeElement;
    const elements = dom.querySelectorAll('input');
    //console.log(elements);    
  }

  /**
   * 
   * @param button htmlelement button
   */
  showColorDialog(button: HTMLElement) {
    this.colorDialog.open(this.page).then (res=> {
      console.log("showColorDialog success");
      console.log(res);
      color_selected(button,res);
    }).catch(err=> {
      console.log("showColorDialog err");
      console.log(err);
    })
    console.log(button);
  }

  cancel() {
    this.layoutService.createActionEvent("componentFormClose",{});
    //this.openIoniconDialog();
    if (this.was_changed) this.layoutService.createActionEvent("pageNeedToRestore",{page_id: this.page.page_id});
  }

  delete() {
    this.layoutService.createActionEvent("componentFormClose",{});
    this.layoutService.createActionEvent("componentDelete",{page_id: this.page.page_id, id: this.component.id});
  }

  save() {
    this.is_saving = true;
    console.log("form_data");
    this.createFormData();
    console.log(this.form_data);

    let position_data = {
      x0: this.component.x0,
      y0: this.component.y0,
      width: this.component.width,
      height: this.component.height,
      css_class: this.component.css_class,
      fixed: this.component.fixed,
      fixed_left: this.component.fixed_left,
      fixed_right: this.component.fixed_right,
      fluid_width: this.component.fluid_width,
      fluid_height: this.component.fluid_height,
      rotate: this.component.rotate,
      use_card: this.component.use_card,
      card_opacity: this.component.card_opacity,
      card_border_radius: this.component.card_border_radius,
      card_border_width: this.component.card_border_width,
      card_background_color: this.component.card_background_color,
      card_border_color: this.component.card_border_color,
      card_shadow: this.component.card_shadow,
      card_padding_top: this.component.card_padding_top,
      card_padding_left: this.component.card_padding_left,
    };

    let visibility:any = {
      and: [],
      or: [],
    }

    this.visibility_list_and.forEach(element => {
      if (element.selected) visibility.and.push(element.code);
    });

    this.visibility_list_or.forEach(element => {
      if (element.selected) visibility.or.push(element.code);
    });


    this.layoutService.updatePageComponent(this.app_id,this.page.page_id, this.component.id,this.form_data, position_data, visibility).then( res => {
      if (res.is_error) {
        console.log("save error!");
        console.error(res);
      } else {
        this.layoutService.createActionEvent("componentFormClose",{});
        this.layoutService.createActionEvent("pageNeedToRestore",{page_id: this.page.page_id});
      }
      this.is_saving = false;
      
    })
    
  }


  openIoniconDialog(button: HTMLElement) {
    this.colorDialog.openIcons(this.page).then (res=> {
      console.log("openIoniconDialog success");
      console.log(res);
      icon_selected(button,res);
    });
}

  private openStringDialog(button: HTMLElement) {
    let values = {};

    if (button.hasAttribute("string-values")) values = JSON.parse(button.getAttribute("string-values"));

    this.stringDialog.open(this.page, values).then(result => {
      console.log("openStringDialog success");
      console.log(result);
      strings_inputted(button, result);
    });
  }

  private openTextDialog(button: HTMLElement) {
    
    let values = {};
    if (button.hasAttribute("string-values")) values = JSON.parse(button.getAttribute("string-values"));
    //console.log("values");
    //console.log(values);
    this.textDialog.open(this.page, values).then(result => {
      console.log("openTextDialog success");
      console.log(result);
      texts_inputted(button, result);
    });
  }

  private openVisibilityDialog(button: HTMLElement) {

    let values = {};
    //console.log(button.getAttribute("visibility-values"));
    if (button.hasAttribute("visibility-values")) values = JSON.parse(button.getAttribute("visibility-values"));

    this.visibilityDialog.open(this.page, values).then(result => {
      console.log("openVisibilityDialog success");
      console.log(result);
      visibility_inputted(button, result);
    });
  }

  private openContentDialog(button: HTMLElement) {
    this.contentDialog.open(this.page).then(result => {
      console.log("openContentDialog success");
      console.log(result);
      content_inputted(button, result);
    });
  }

  private openGalleryDialog(button: HTMLElement) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '1000px';
    this.appService.getApplicationById(this.app_id).then(response => {
      let resources_dir = 'storage/application/' + response.id + "-" + response.unique_string_id + '/resources//';
      dialogConfig.data = new GalleryDialog(resources_dir, false, '.jpg,.png,.jpeg,.ico,.svg', resources_dir);
      const dialogRef = this.galleryDialog.open(GalleryDialogComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          console.log(result);
          gallery_inputted(button, result);
        }
      });
    });
  }


  onFixedPosChange(ev:any) {
    console.log("onFixedPosChange");
    console.log(ev);
  }

  selectTab(event, index: number) {
    event.preventDefault();
    this.selectedTab = index;
  }
  
  changeCardBorderRadiusSlider() {

  }
  
  
  changeCardBorderWidhSlider() { 

  }
  
  changeCardOpacitySlider() { 
    console.log(this.page);
    console.log(this.component);
  }


  setCardBorderColor() {
    this.colorDialog.open(this.page).then (res=> {
      console.log("showColorDialog success");
      console.log(res);
      this.card_border_color_value = res.color_value;
      this.component.card_border_color = res.color_name;
    }).catch(err=> {
      console.log("showColorDialog err");
      console.log(err);
    })    
  }

  setCardBackgroundColor() {
    this.colorDialog.open(this.page).then (res=> {
      console.log("showColorDialog success");
      console.log(res);
      this.card_background_color_value = this.addAlpha(res.color_value,this.component.card_opacity);
      this.card_background_color_value_wo_alfa = res.color_value;
      this.component.card_background_color = res.color_name;
    }).catch(err=> {
      console.log("showColorDialog err");
      console.log(err);
    })    
  }

  addAlpha(color: string, opacity: number): string {
    // coerce values so ti is between 0 and 1.
    const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
    return color + _opacity.toString(16).toUpperCase();
  }  
  
}
