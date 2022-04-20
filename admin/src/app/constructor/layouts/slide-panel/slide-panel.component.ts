import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { LayoutService} from '../../../services/layout.service';
import { DomSanitizer} from '@angular/platform-browser';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-slide-panel',
  templateUrl: './slide-panel.component.html',
  styleUrls: ['./slide-panel.component.scss'],
  
})
export class SlidePanelComponent implements OnInit {

  private subject = new Subject<any>();

  available_page_list:any[] = [];
  available_headers_list:any[] = [];
  available_components_list:any[] = [];
  private app_id:number;
  form_type:string = "";
  current_list:string = "main";
  selected_list:any = {};
  components_loaded:boolean = false;


  drag_in_process:boolean = false;
  drag_x:number = 0;
  drag_y:number = 0;
  initialX: number = 0;
  initialY: number = 0;
  currentX : number = 0;
  currentY : number = 0;
  drag_translate : string = "";
  drag_image: any = "";

  constructor(private sanitizer: DomSanitizer, private router: Router, private layoutService:LayoutService,) { }

  ngOnInit(): void {
    this.app_id = Number(this.router.url.match(/constructor\/(\d+)/)[1]);

    //catch event from sidemenu components
    this.layoutService.onSideActionSubject().subscribe((event:any)=>{
      //console.log(event);
      if (event.event=="pageFormSubmit") this.current_list="pages"; //event to close form menu
      if (event.event=="pageFormClose") this.current_list="pages"; //event to close form menu
    });

    this.available_page_list = [];
    this.available_headers_list = [];

    this.layoutService.getlayoutItems(this.app_id).then( response=>{
      
      //pages
      console.log("response.pages");
      console.log(response);
      console.log(response.pages);
      response.pages.forEach(page => {
        this.available_page_list.push(
          {
            page_name: page.page_name,
            page_type: page.page_type,
            image: page.image,
          }
        );        
      });


      //components
      response.components.forEach(category => {

        let c: any = Object.assign({},category);
        c.items = [];
        if (category.items.length>0) {
          category.items.forEach(item => {
            let h = item;
            h.svg = this.sanitizer.bypassSecurityTrustHtml(h.image);
            c.items.push(h);
            //console.log("asdsads");
            //console.log(item);
          });
        }
        this.available_components_list.push(c);
      });
      
      //console.log("available_components_list");
      //console.log(this.available_components_list);
      this.components_loaded = true;
    })

  }

  /**
   * Run close panel event
   */
  closeSideComponentPanel() {
    this.layoutService.closeSideComponentPanelEvent();
  }


  /**
   * Show add page form in aside
   * @param page_type page type
   */
  addPage(page_type:string) {
    this.form_type = page_type;
    this.current_list = 'create_page';
  }


  /**
   * Mouse down on element
   * @param ev event
   */
  mouseDown(ev:any,item:any) {
    console.log("slidepanel  mosue down");
    console.log(ev);
    this.drag_in_process = true;
    this.layoutService.createActionEvent("drag_copy_component_start",{event: ev, item: item});
    //this.closeSideComponentPanel();
    //this.drag_x = ev.clientX;
    //this.drag_y = ev.clientY;
    this.drag_image = this.sanitizer.bypassSecurityTrustHtml(item.image);
    this.drag_in_process = true;
    this.initialX = ev.clientX - this.currentX;
    this.initialY = ev.clientY - this.currentY;
    ev.preventDefault();
  }


  mouseUp(ev:any,item:any) {
    //console.log("slidepanel mouseUp");
    //console.log(ev);
    this.drag_in_process = false;
    this.layoutService.createActionEvent("drag_copy_component_stop",{event: ev, item: item});
  }
  @HostListener('window:mousemove', ['$event']) 
  onMouseMove(event) {
    //if (this.drag_in_process) console.log(event);
    this.currentX = event.clientX+5;// - this.initialX;
    this.currentY = event.clientY+5;// - this.initialY;
    this.drag_translate = "translate3d(" + this.currentX + "px, " + this.currentY + "px, 0)";
  }

  /*@HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent){
    if (this.drag_in_process) this.layoutService.createActionEvent("drag_copy_component_move",{event: event});
  } */ 
  
}
