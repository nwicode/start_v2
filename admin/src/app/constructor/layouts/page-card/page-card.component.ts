import { Component, OnInit, Input, Output, Inject, ViewChild, ElementRef, AfterViewInit, HostListener, EventEmitter, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService} from '../../../services/layout.service';
import {environment} from "../../../../environments/environment";
import { DomSanitizer } from '@angular/platform-browser';
import {DOCUMENT} from '@angular/common';

import $ from 'jquery';
declare var require: any
import 'jquery-ui-dist/jquery-ui';


const enum Status {
  OFF = 0,
  RESIZE = 1,
  MOVE = 2
}

@Component({
  selector: 'app-page-card',
  templateUrl: './page-card.component.html',
  styleUrls: ['./page-card.component.scss','./ionic.bundle.css']
})
export class PageCardComponent implements OnInit, AfterViewInit {


  @Output() onDelete = new EventEmitter();
  @Output() onSettings = new EventEmitter();
  @Output() onMove = new EventEmitter();
  @Output() onEndMove = new EventEmitter();
  @Output() onEndResize = new EventEmitter();
  @Output() onDropComponent = new EventEmitter();
  

  @Input('type') public type: string;
  @Input('name') public name: string;
  @Input('can_delete') public can_delete: number;
  @Input('width') public width: number;
  @Input('height') public height: number;
  @Input('left') public left: number;
  @Input('top') public top: number;
  @Input('scale') public scale: number;
  @Input('page_id') public page_id: number;
  @Input('page_index') public page_index: number;
  @Input('height_orig') public height_orig: number;
  @Input('selected') public selected: boolean;

  //@ViewChild("box") public box: ElementRef;
  private boxPosition: { left: number, top: number };
  private containerPos: { left: number, top: number, right: number, bottom: number };
  public mouse: {x: number, y: number}
  public status: Status = Status.OFF;
  public status_previous: Status = Status.OFF;
  private mouseClick: {x: number, y: number, left: number, top: number}
  private mouse_y_pos: number;
  current_height: number;

  public background_image_size:string = "";
  public background_image_mode:string = "";
  public background_image:string = "";

  page_loaded: boolean = false;
  private app_id: number;

  //frame settings
  frame_background_color:string = "#fff";

  //inner page html 
  public ionic_html:any ="";
  public pageHtml:any ="";
  public pageCss:any = "";
  public style:any;
  hasfooter: boolean;

  private draggable_click:any = {
    x: 0,
    y: 0
  };

  constructor(@Inject(DOCUMENT) private document:Document, private el:ElementRef, private rendrer: Renderer2,  private ref: ChangeDetectorRef, private router: Router, private layoutService:LayoutService, private sanitizer:DomSanitizer) { }

  ngOnInit() {


    this.addComponentClickListeners();

    this.style = this.document.createElement('style');

    this.app_id = Number(this.router.url.match(/constructor\/(\d+)/)[1]);


    //catch event from sidemenu components
    this.layoutService.onSideActionSubject().subscribe((event:any)=>{

      //if page has been modified on side panel
      if (event.event=="pageModifiedBySettings" && this.page_id == event.data.page_id) {  //crete new page event
        this.applySettingsToFrame(event.data.page_settings);
      } else if (event.event=="pageNeedToRestore" && this.page_id == event.data.page_id) {  //crete new page event
        this.page_loaded = false;
        this.loadBox()
      } else if (event.event=="updateHeight" && this.page_id == event.data.page_id) {  //crete new page event
        this.current_height = Math.floor(event.data.height);
        //console.log(event)
      }  

      
    });
  }


  ngAfterViewInit(){
    //console.log("ngAfterViewInit");
    //console.log(this.current_height);
    if (!this.current_height) this.current_height = this.height;
    //console.log(this.current_height);
    this.loadBox();
    this.ref.detectChanges();
    
  }


  /**
   * Load page data from server
   */
  private loadBox(){
    this.layoutService.getPageData(this.app_id,this.page_id).then( response => {
      this.page_loaded = true;
      this.applySettingsToFrame(response);
      this.ref.detectChanges();
    });

  }

  private loadContainer(){
    const left = this.boxPosition.left - this.left;
    const top = this.boxPosition.top - this.top;
    const right = left + 600;
    const bottom = top + 450;
    this.containerPos = { left, top, right, bottom };
  }

  setStatus(event: MouseEvent, status: number){
    ///console.log(event);
    //console.log(status);
    if(status === 1) {
      event.stopPropagation();
    
      this.mouse_y_pos = event.clientY;
      console.log("ngAfterViewInit");
      console.log(this.current_height);
    }
    else if(status === 2) this.mouseClick = { x: event.clientX, y: event.clientY, left: this.left, top: this.top };
    //else this.loadBox();
    this.status_previous = this.status;
    this.status = status;
    
    if (status === 0 && this.status_previous === Status.MOVE) this.onEndMove.emit({height:this.current_height,page_id:this.page_id, page_index:this.page_index});
    if (status === 0 && this.status_previous === Status.RESIZE) this.onEndResize.emit({height:this.current_height,page_id:this.page_id, page_index:this.page_index});
  }  


  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent){
    this.mouse = { x: event.clientX, y: event.clientY };
    //console.log(this.mouse);
    if(this.status === Status.RESIZE) this.resize();
    else if(this.status === Status.MOVE) this.move();
  }

  private resize(){

    let scale = 1;
    if (Number(this.scale).toFixed(1)=="2.6") scale = 1.6;
    else if (Number(this.scale).toFixed(1)=="2.0") scale = 0.47;
    else if (Number(this.scale).toFixed(1)=="1.9") scale = 0.49;
    else if (Number(this.scale).toFixed(1)=="1.8") scale = 0.53;
    else if (Number(this.scale).toFixed(1)=="1.7") scale = 0.57;
    else if (Number(this.scale).toFixed(1)=="1.6") scale = 0.61;
    else if (Number(this.scale).toFixed(1)=="1.5") scale = 0.65;
    else if (Number(this.scale).toFixed(1)=="1.4") scale = 0.70;
    else if (Number(this.scale).toFixed(1)=="1.3") scale = 0.76;
    else if (Number(this.scale).toFixed(1)=="1.2") scale = 0.81;
    else if (Number(this.scale).toFixed(1)=="1.1") scale = 0.9;
    else if (Number(this.scale).toFixed(1)=="0.9") scale = 1.1;
    else if (Number(this.scale).toFixed(1)=="0.8") scale = 1.25;
    else if (Number(this.scale).toFixed(1)=="0.7") scale = 1.4;
    else if (Number(this.scale).toFixed(1)=="0.6") scale = 1.6;
    else if (Number(this.scale).toFixed(1)=="0.5") scale = 2;
    else if (Number(this.scale).toFixed(1)=="0.4") scale = 2.5;
    else if (Number(this.scale).toFixed(1)=="0.3") scale = 3.2;    

    let diff = this.mouse.y - this.mouse_y_pos;
    //console.log(diff);
    //this.onResize.emit({diff:diff, page_id:this.page_id});
    if (this.height + diff*scale >= this.height_orig) this.current_height = this.height + diff*scale;
    //this.onEndResize.emit({height:this.current_height,page_id:this.page_id})
    //console.log(this.current_height);
  }

  private resizeCondMeet(){
    //return (this.mouse.x < this.containerPos.right && this.mouse.y < this.containerPos.bottom);
  }

  private move(){
    //if(this.moveCondMeet()){

    let scale = 1;
    if (Number(this.scale).toFixed(1)=="2.6") scale = 1.6;
    else if (Number(this.scale).toFixed(1)=="2.0") scale = 0.47;
    else if (Number(this.scale).toFixed(1)=="1.9") scale = 0.49;
    else if (Number(this.scale).toFixed(1)=="1.8") scale = 0.53;
    else if (Number(this.scale).toFixed(1)=="1.7") scale = 0.57;
    else if (Number(this.scale).toFixed(1)=="1.6") scale = 0.61;
    else if (Number(this.scale).toFixed(1)=="1.5") scale = 0.65;
    else if (Number(this.scale).toFixed(1)=="1.4") scale = 0.70;
    else if (Number(this.scale).toFixed(1)=="1.3") scale = 0.76;
    else if (Number(this.scale).toFixed(1)=="1.2") scale = 0.81;
    else if (Number(this.scale).toFixed(1)=="1.1") scale = 0.9;
    else if (Number(this.scale).toFixed(1)=="0.9") scale = 1.1;
    else if (Number(this.scale).toFixed(1)=="0.8") scale = 1.25;
    else if (Number(this.scale).toFixed(1)=="0.7") scale = 1.4;
    else if (Number(this.scale).toFixed(1)=="0.6") scale = 1.6;
    else if (Number(this.scale).toFixed(1)=="0.5") scale = 2;
    else if (Number(this.scale).toFixed(1)=="0.4") scale = 2.5;
    else if (Number(this.scale).toFixed(1)=="0.3") scale = 3.2;


    this.left = this.mouseClick.left + (this.mouse.x - this.mouseClick.x)*scale;
    this.top = this.mouseClick.top + (this.mouse.y - this.mouseClick.y)*scale;
    
    /*console.log("this.mouse.x "+this.mouse.x);
    console.log("this.mouseClick.x "+this.mouseClick.x);
    console.log("this.mouseClick.left "+this.mouseClick.left);*/

    //console.log("left "+this.left+" top "+this.top);
    this.onMove.emit({left:this.left, top:this.top,page_id:this.page_id, page_index:this.page_index});
    //}
  }

  private moveCondMeet(){
    /*const offsetLeft = this.mouseClick.x - this.boxPosition.left; 
    const offsetRight = this.width - offsetLeft; 
    const offsetTop = this.mouseClick.y - this.boxPosition.top;
    const offsetBottom = this.height - offsetTop;
    return (
      this.mouse.x > this.containerPos.left + offsetLeft && 
      this.mouse.x < this.containerPos.right - offsetRight &&
      this.mouse.y > this.containerPos.top + offsetTop &&
      this.mouse.y < this.containerPos.bottom - offsetBottom
      );*/
  }

  /**
   * Click on delete button
   */
  delete() {
    this.onDelete.emit({page_id:this.page_id, page_name:this.name});
  }


  openSettings() {
    this.onSettings.emit({page_id:this.page_id, page_name:this.name});
  }


  /**
   * Apply page settings to 'frame'
   * @param page_settings - page settins and items
   */
  applySettingsToFrame(page_settings) {
    
    //first, find bg color
    // if color values has # - then set this value as bg, else scan all colors and find color by name

    if (page_settings.page.background.includes('#')) this.frame_background_color = page_settings.page.background; 
    else {
      page_settings.colors_main.forEach(color=> {
        if (color.color_name==page_settings.page.background) this.frame_background_color = color.color_value;
      });
      page_settings.colors_system.forEach(color=> {
        if (color.color_name==page_settings.page.background) this.frame_background_color = color.color_value;
      });
      page_settings.colors_user.forEach(color=> {
        if (color.color_name==page_settings.page.background) this.frame_background_color = color.color_value;
      });
    }

    /**
     * In case image gackground mode, assign values
     */
    if (page_settings.page.background_image=='none') {
      this.background_image = "";
    } else if (page_settings.page.background_image=='default') {
      this.background_image = page_settings.default_background_mode.background_image;
      this.background_image_mode = page_settings.default_background_mode.background_image_mode;
      page_settings.page.background_image_size = page_settings.default_background_mode.background_image_size;      
    } else {
      //nothing to do
      this.background_image_size = page_settings.page.background_image_size;
      this.background_image_mode = page_settings.page.background_image_mode;
      this.background_image = page_settings.page.background_image;
    }

    //bg images
    if (this.background_image.includes('data:image')) this.background_image = this.background_image; else   this.background_image = environment.apiUrl + "storage/application/" + page_settings.page.application_id + "-" + page_settings.page.unique_string_id + '/resources/' + this.background_image;


    //start page animations
    if (page_settings.page.type=='start') {
      let selectedAnimation:any = {};
      selectedAnimation.id = 0;
      selectedAnimation.html = "";
      selectedAnimation.css = "";

      if (page_settings.page.current_animation!=0) {
        page_settings.page.start_animations.forEach(element => {
          if (element.id==page_settings.page.current_animation) {
            selectedAnimation = element;
            page_settings.selectedAnimation = selectedAnimation;
          }
        });
      } else {
        selectedAnimation.html = page_settings.page.custom_app_animation_html;
        selectedAnimation.css = page_settings.page.custom_app_animation_css;
        selectedAnimation.color1 = "";
        selectedAnimation.color2 = "";
        selectedAnimation.color3 = "";
        selectedAnimation.color4 = "";
        selectedAnimation.color5 = "";
      }

      console.log("selectedAnimation");
      console.log(selectedAnimation);
      let generated_html = selectedAnimation.html;
      generated_html = generated_html.replaceAll("{{color1}}",selectedAnimation.color1);
      generated_html = generated_html.replaceAll("{{color2}}",selectedAnimation.color2);
      generated_html = generated_html.replaceAll("{{color3}}",selectedAnimation.color3);
      generated_html = generated_html.replaceAll("{{color4}}",selectedAnimation.color4);
      generated_html = generated_html.replaceAll("{{color5}}",selectedAnimation.color5);
      generated_html = generated_html.replaceAll("{{'START_LOADING_TEXT' | translate}}","Loading..");
      generated_html = generated_html.replaceAll('{{"START_LOADING_TEXT" | translate}}',"Loading..");
      page_settings.page.generated_html = generated_html;
  
      let generated_css = selectedAnimation.css;
      generated_css = generated_css.replaceAll("{{color1}}",selectedAnimation.color1);
      generated_css = generated_css.replaceAll("{{color2}}",selectedAnimation.color2);
      generated_css = generated_css.replaceAll("{{color3}}",selectedAnimation.color3);
      generated_css = generated_css.replaceAll("{{color4}}",selectedAnimation.color4);
      generated_css = generated_css.replaceAll("{{color5}}",selectedAnimation.color5);
      page_settings.page.generated_css = generated_css;
    }


    //add css if exists
    if (page_settings.page.hasOwnProperty('generated_css')) {
      //this.pageCss = this.sanitizer.bypassSecurityTrustHtml(page_settings.page.generated_css);
      this.pageCss = page_settings.page.generated_css;
    } else {
      this.pageCss= "";
    }    


    //set inner html if exists
    if (page_settings.page.hasOwnProperty('generated_html')) {
      this.pageHtml = this.sanitizer.bypassSecurityTrustHtml('<style>'+this.pageCss+'</style>'+page_settings.page.generated_html);
    } else {
      this.pageHtml= "";
    }

    //if html get from core, just add to window
    if (page_settings.page.hasOwnProperty('ionic_html')) {
      this.ionic_html = this.sanitizer.bypassSecurityTrustHtml(page_settings.page.ionic_html);
    } else {
      this.ionic_html ="-";
    }


    //console.log(page_settings);
    this.ref.detectChanges();
    this.addComponentClickListeners();

    //create first lines
    this.initDragLines(page_settings.page.id);


    //add resize helpers to page
    this.addResizeHelpers(page_settings.page.id);

    //make all drag and resize
    this.initDraggableAndResizeble(page_settings.page.id);
  }


  /**
   * Init draggable and resizeble
   */
  initDraggableAndResizeble(ion_content_id) {
    const component = this;

    //ion-content
    /*$( ".ui-sortable" ).sortable({
      start: function( event, ui ) {
        $( ".component_wrapper").addClass("component-selectable-other");
        console.log('sort start');
      },
      stop: function( event, ui ) {
        $( ".component_wrapper").removeClass("component-selectable-other");
        console.log('sort stop');
      },
      handle: '.component_wrapper_sortable_handle'
    });*/


    //outer wrapper component
    $( "#ion-content"+ion_content_id+" .component_wrapper.component-resizeble" ).resizable({
      containment: "#ion-content"+this.page_id,
      handles: 's',
      start: function( event, ui ) {
        $( ".component_wrapper").addClass("component-selectable-other");
        component.componentDragStart(event, ui, ion_content_id);
      },
      stop: function( event, ui ) {
        $( ".component_wrapper").removeClass("component-selectable-other");
        component.componentDragStop(event, ui, ion_content_id);
      },   
      grid: [ 5, 5 ]  
    });

    

    $( "#ion-content"+ion_content_id+" .component_inner_wrapper.component-draggable" ).draggable({
       containment: "#ion-content"+ion_content_id,
       start: function( event, ui ) { component.componentDragStart(event, ui, ion_content_id);},
       stop: function( event, ui ) { component.componentDragStop(event, ui, ion_content_id);},
       drag: function( event, ui ) { component.componentDragDrag(event, ui,ion_content_id);},
       snap: "#ion-content"+ion_content_id+", #ion-content"+ion_content_id+" .drag-reference, .component_inner_wrapper",
       //snapTolerance: 10,
       //zIndex: 100
       grid: [ 5, 5 ],
       snapMode: "both",
       snapTolerance: 5,
       //snap: true
    });

    

    $( "#ion-content"+ion_content_id+" .component_inner_wrapper.component-resizeble" ).resizable({
       containment: "#ion-content"+ion_content_id,
       handles: 'e',

      start: function( event, ui ) {
        component.componentDragStart(event, ui, ion_content_id);
      },
      stop: function( event, ui ) {
        component.componentDragStop(event, ui, ion_content_id);
      }, 
      resize: function( event, ui ) { component.componentResize(event, ui, ion_content_id);},
      grid: [ 5, 5 ],
      snapMode: "both",
      snapTolerance: 3,
      distance: 20,
      snap: '.drag-reference, .component_inner_wrapper'
    });


    $( "#ion-content"+ion_content_id+" .component_inner_wrapper.component-resizeble-hv" ).resizable({
       containment: "#ion-content"+ion_content_id,
       handles: 'e,s',
       start: function( event, ui ) {
        component.componentDragStart(event, ui, ion_content_id);
      },
      stop: function( event, ui ) {
        component.componentDragStop(event, ui, ion_content_id);
      }, 
      resize: function( event, ui ) { component.componentResize(event, ui, ion_content_id);},
      grid: [ 5, 5 ],
      snapMode: "both",
      snapTolerance: 3,
      distance: 20,
      snap: "#ion-content"+ion_content_id
    });
  }


  /**
   * Event fired on drag start
   * need to draw lines
   * @param event event
   * @param ui ui
   */
  componentDragStart(event, ui, ion_content_id) {
    console.log("drag start");
    
    //scale fix
    //console.log(event);
    this.draggable_click.x = event.clientX;
    this.draggable_click.y = event.clientY;
    
    
    
    let el = event.target;
    //console.log($(el).parent());
    //console.log(ui);

    $( "#ion-content"+ion_content_id+" .component_inner_wrapper" ).addClass("component-selectable-other");
    event.stopPropagation();
  }

  /**
   * Event fired on drag progress
   * need to draw lines
   * @param event event
   * @param ui ui
   */
  componentDragDrag(event, ui, ion_content_id) {
    //console.log("drag drag");
   
        // This is the parameter for scale()
        var zoom = this.scale;
        //console.log(zoom.toFixed(2));
        var original = ui.originalPosition;

        var canvasHeight = $("#ion-content"+ion_content_id).height();
        var canvasWidth = $("#ion-content"+ion_content_id).width();

        // jQuery will simply use the same object we alter here
        if (zoom.toFixed(2)!="1.00" && zoom.toFixed(2)!="0.99") {
          ui.position = {
              left: (event.clientX - this.draggable_click.x + original.left) / zoom,
              top:  (event.clientY - this.draggable_click.y + original.top ) / zoom
          };
        }

        //console.log(ui.position);
        // don't let draggable to get outside of the canvas
        if (ui.position.left < 0) ui.position.left = 0;
        if (ui.position.top < 0) ui.position.top = 0;        
        if (ui.position.left + ui.helper.width() > canvasWidth) ui.position.left = canvasWidth - ui.helper.width();  
        //if (ui.position.top + ui.helper.height() > canvasHeight) ui.position.top = canvasHeight - ui.helper.height();

    event.stopPropagation();
  }
  /**
   * Event fired on куышяу progress
   * need to draw lines
   * @param event event
   * @param ui ui
   */
  componentResize(event, ui,ion_content_id) {
    console.log("componentResize");

        // This is the parameter for scale()
        var zoom = this.scale;

        /*var original = ui.originalPosition;

        var changeWidth = ui.size.width - ui.originalSize.width; // find change in width
        var newWidth = ui.originalSize.width + changeWidth / zoom; // adjust new width by our zoomScale

        var changeHeight = ui.size.height - ui.originalSize.height; // find change in height
        var newHeight = ui.originalSize.height + changeHeight / zoom; // adjust new height by our zoomScale
        ui.size.width = newWidth;
        ui.size.height = newHeight;*/

        var changeWidth = ui.size.width - ui.originalSize.width; // find change in width
        var newWidth = ui.originalSize.width + changeWidth / zoom; // adjust new width by our zoomScale
    
        var changeHeight = ui.size.height - ui.originalSize.height; // find change in height
        var newHeight = ui.originalSize.height + changeHeight / zoom; // adjust new height by our zoomScale
    
        var canvasHeight = $("#ion-content"+ion_content_id).height();
        var canvasWidth = $("#ion-content"+ion_content_id).width();        

        if (newWidth>375) newWidth = 375;
        if (ui.position.left < 0) ui.position.left = 0;
        if (ui.position.top < 0) ui.position.top = 0;   
        ui.originalElement.width(newWidth);
        ui.originalElement.height(newHeight);

    event.stopPropagation();
  }




  /**
   * Event fired on drag stop
   * @param event event
   * @param ui ui
   */
   componentDragStop(event, ui,ion_content_id) {
    console.log("drag stop");

    $( "#ion-content"+ion_content_id+" .component_inner_wrapper" ).removeClass("component-selectable-other");

    //get ion content and get ID
    let drag_element:HTMLElement = event.target;


    //call event for update X and Y in component form
    this.layoutService.createActionEvent("componentWasMovied",{
      'page_id': ion_content_id,
      'component_id': drag_element.getAttribute('component-id'),
      'height': drag_element.clientHeight,
      'width': drag_element.clientWidth,
      'left': drag_element.offsetLeft,
      'top': drag_element.offsetTop,
    });


    //remove lines in current page
    $('#ion-content'+ion_content_id+' .drag-reference').remove();


    let positions:any[] = [];

    //draw lines
    let max_height:number = 0;
    $('#ion-content'+ion_content_id+' .component_inner_wrapper').each(function (i, item) {
      //var $reference = $('<div>', { 'class': 'drag-reference' });
      var $elem = $(item);
      var $container = $elem.parent();
      var position = $elem.position();
      var _HTMLElement = $elem[0];

      var top1 =_HTMLElement.offsetTop;
      var left1 = _HTMLElement.offsetLeft;
      var top2 = _HTMLElement.offsetTop+$elem.height();
      var left2 = _HTMLElement.offsetLeft+$elem.width();

      if (top2 > max_height) max_height = top2;

      /*var top1 = position.top;
      var left1 = position.left;
      var top2 = position.top+$elem.height();
      var left2 = position.left+$elem.width();*/

      //add blocks
     /* var $reference = $('<div>', { 'class': 'drag-reference' });
      $reference.insertBefore($elem);
      $reference.css({
          top: 1,
          left: left1+'px',
          height: $container.height(),
          position: "absolute",
          display: "block",
          opacity: 0,
          //border: "1px dashed red",
          width: $elem.width()+"px"
      });  

      $reference = $('<div>', { 'class': 'drag-reference' });
      $reference.insertBefore($elem);
      $reference.css({
          top: top1+'px',
          left: 1,
          height: $elem.height()+'px',
          position: "absolute",
          display: "block",
          opacity: 0,
          //border: "1px dashed red",
          width: $container.width()
      }); */

      //console.log('position', position);
      if ($elem.attr("component-id")) {
        var _HTMLElement = $elem[0];
        positions.push({
          x0: _HTMLElement.offsetLeft,
          y0: _HTMLElement.offsetTop,
          height: $elem.height(),
          width: $elem.width(),
          rotate: 0,
          parent_height:$container.height(),
          parent_width:$container.width(),
          id: $elem.attr("component-id")
        });
        //update position in core

      }

      
      
    }); 

    this.initDraggableAndResizeble(ion_content_id);
    this.updateComponentsPosition(positions);
    //console.log(this.page_id);
    this.onEndResize.emit({height:max_height+150,page_id:ion_content_id, page_index:this.page_index});


    event.stopPropagation();
  }


  /**
   * update positions in core
   * @param positions array with posotions object
   */
  updateComponentsPosition(positions:any) {
    this.layoutService.updateComponentsPosition(this.app_id, this.page_id,positions).then( response =>{
      console.log("updateComponentsPosition done");
    });

  }

  @HostListener('mouseup', ['$event']) 
  onMouseMove1(event) {
    this.onDropComponent.emit(event);
  }
  



  
  /**
   * Event fired on drag stop
   * @param event event
   * @param ui ui
   */
   initDragLines(page_card_id) {


    $('#ion-content'+page_card_id+' .drag-reference').remove();

    //draw lines
    $('#ion-content'+page_card_id+'.component_inner_wrapper').each(function (i, item) {
      var $reference = $('<div>', { 'class': 'drag-reference' });
      var $elem = $(item);
      var $container = $elem.parent();
      var position = $elem.position();
      var _HTMLElement = $elem[0];

      var top1 =_HTMLElement.offsetTop;
      var left1 = _HTMLElement.offsetLeft;
      var top2 = _HTMLElement.offsetTop+$elem.height();
      var left2 = _HTMLElement.offsetLeft+$elem.width();

      /*var top1 = position.top;
      var left1 = position.left;
      var top2 = position.top+$elem.height();
      var left2 = position.left+$elem.width();*/

      //add blocks
      /*var $reference = $('<div>', { 'class': 'drag-reference' });
      $reference.insertBefore($elem);
      $reference.css({
          top: 0,
          left: left1+'px',
          height: $container.height(),
          position: "absolute",
          display: "block",
          opacity: 0,
          //border: "1px dashed red",
          width: $elem.width()+"px"
      });  

      $reference = $('<div>', { 'class': 'drag-reference' });
      $reference.insertBefore($elem);
      $reference.css({
          top: top1+'px',
          left: 0,
          height: $elem.height()+'px',
          position: "absolute",
          display: "block",
          opacity: 0,
          //border: "1px dashed red",
          width: $container.width()
      }); */
    });  
  }  


  /**
   * Add resize helpers to each div
   */
  addResizeHelpers(ion_content_id) {
    /*$('#ion-content'+ion_content_id+' .component_inner_wrapper').each(function (i, item) {
      var $elem = $(item);
      var $reference = $('<div>', { 'class': 'ui-resizable-handle ui-resizable-nw', 'id':"nwgrip" });
      $reference.appendTo($elem);
      
      $reference = $('<div>', { 'class': 'ui-resizable-handle ui-resizable-nw', 'id':"negrip" });
      $reference.appendTo($elem);
      
      $reference = $('<div>', { 'class': 'ui-resizable-handle ui-resizable-nw', 'id':"swgrip" });
      $reference.appendTo($elem);

      $reference = $('<div>', { 'class': 'ui-resizable-handle ui-resizable-nw', 'id':"segrip" });
      $reference.appendTo($elem);

      $reference = $('<div>', { 'class': 'ui-resizable-handle ui-resizable-nw', 'id':"ngrip" });
      $reference.appendTo($elem);

      $reference = $('<div>', { 'class': 'ui-resizable-handle ui-resizable-nw', 'id':"sgrip" });
      $reference.appendTo($elem);

      $reference = $('<div>', { 'class': 'ui-resizable-handle ui-resizable-nw', 'id':"egrip" });
      $reference.appendTo($elem);

      $reference = $('<div>', { 'class': 'ui-resizable-handle ui-resizable-nw', 'id':"wgrip" });
      $reference.appendTo($elem);

    });*/
  }
  /**
   * Add click lnstener to component
   */
   addComponentClickListeners() {
    const page_card = this.el.nativeElement.querySelector(".page-card");
    const components = page_card.querySelectorAll("div, ion-card");
    components.forEach(component => {
      if (component.hasAttribute('component-id')) {
        //component.replaceWith(component.cloneNode(true));
        component.addEventListener('click', (event:any)=>{
          //set event to list (for open component form)
          this.layoutService.createActionEvent("componentSelectedByMouse", {component_id: component.getAttribute('component-id')});
          event.preventDefault();
        });        
      }
    });
  }

}


