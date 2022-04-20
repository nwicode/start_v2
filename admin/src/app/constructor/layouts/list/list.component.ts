import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, AfterViewInit, QueryList, ViewChildren, Renderer2 } from '@angular/core';
import {Page} from '../../../interfaces/page';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { LayoutService} from '../../../services/layout.service';
import { Router , Event,  NavigationStart , NavigationEnd , NavigationError} from '@angular/router';

import 'leader-line';
declare let LeaderLine: any;

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  animations: [
    trigger('sideComponent', [
      state('false', style({ transform: 'translateX(-600px)'})),
      state('true', style({ transform: 'translateX(0)' })),
      transition('false <=> true', animate('0.3s'))
    ])
  ]  
})
export class ListComponent implements OnInit, AfterViewInit {
  
  @ViewChildren('appcards',{read: ElementRef }) appcards:QueryList<ElementRef>;

  componentMenuState: string = "false";
  componentDeleteFormMenuState: string = "false";
  componentSettingsFormMenuState: string = "false";
  componentComponentFormMenuState: string = "false";

  app_id: number;
  widthExp: 10000;
  page_id_for_delete: number;
  page_name_for_delete: string;
  selected_page: number = 0;
  selected_page_full: any = {};
  pages: Page[] = [];
  lines: any[] = [];
  scale:number = 0.6; //scale parameter

  //drag drop components
  dragged_component:any = {};
  drag_process: boolean = false;


  //list of components
  component_list:any[] = [];

  constructor(private el:ElementRef, private rendrer: Renderer2,  private router: Router, private layoutService:LayoutService, private ref: ChangeDetectorRef, ) { 



    this.router.events.subscribe((event: Event) => {
        if (event instanceof NavigationStart) {
            // Show loading indicator
            this.clearLines();
        }

        if (event instanceof NavigationEnd) {
            // Hide loading indicator
        }

        if (event instanceof NavigationError) {
            // Hide loading indicator

            // Present error to user
            console.log(event.error);
        }
    });

  }

  ngOnInit(): void {

    //close side menu event
    this.layoutService.onSideButtonPressed().subscribe(()=>{
      this.showSideComponent();
    })

    //close side menu event
    this.layoutService.onSideCloseButtonPressed().subscribe(()=>{
      this.componentMenuState = "false";
    });

    //catch event from sidemenu components
    this.layoutService.onSideActionSubject().subscribe((event:any)=>{
      //console.log("event");
      //console.log(event);
      if (event.event=="pageFormSubmit") {  //crete new page event
        //console.log("try to create new page");
        this.addPage(event.data.form_name, event.data.form_type);
      } else if (event.event=="pageDeleteFormClose") {  //close delete form side component
        this.componentDeleteFormMenuState = 'false';
      } else if (event.event=="componentFormClose") {  //close delete form side component
        this.componentComponentFormMenuState = 'false';
      } else if (event.event=="drag_copy_component_start") {  //close delete form side component
        this.dragged_component = event.data.item;
        this.drag_process = true;
      } else if (event.event=="drag_copy_component_stop") {  //close delete form side component
        this.drag_process = false;
      } else if (event.event=="componentDelete") {  //delete component
        this.deleteComponentFromPage(event.data);
      } else if (event.event=="pageNeedToRestore") {  //some page was changes, need to redraw lines
        this.clearLines()
        this.drawLines();
        if (this.selected_page!=0) this.loadPageComponents(this.selected_page);
        //console.log("pageNeedToRestore 1");
        //console.log(event);
      } else if (event.event=="componentSelectedByMouse") {  //mouise clic on component on page
        
        this.component_list.forEach( c=>{
          if (c.id == event.data.component_id) this.showComponentForm(c,0);
        })

      } else if (event.event=="componentWasMovied") {
        console.log ("componentWasMovied");
        //console.log (this.component_list);
        //console.log (event.data);
        this.recalcLines();
        this.component_list.forEach(component => {
          if (component.id==event.data.component_id) {
            component.x0 = event.data.left;
            component.x = event.data.left;
            component.y0 = event.data.top;
            component.y = event.data.top;
            component.width = event.data.width;
            component.height = event.data.height;            
          }
        });

      }

      
    });


    this.app_id = Number(this.router.url.match(/constructor\/(\d+)/)[1]);
    
    this.layoutService.getPages(this.app_id).then(result => {
      let array_pos = 0;
      result.pages.forEach(p => {
        let page:any = {
          left: p.pos_x,
          top: p.pos_y,
          width: p.width?p.width:375,
          height: p.height?p.height:640,
          height_orig: 640,
          page_id: p.id,
          page_index: array_pos,
          type: p.type,
          title: p.name,
          can_delete: p.can_delete,
          name: p.name
        };   
        this.pages.push(page);
        array_pos++; 
      });
      this.ref.detectChanges();
   
      setTimeout( ()=>{
        /*const p1 = document.getElementById("app-card-id1");
        const p2 = document.getElementById("app-card-id2");
        const p3 = document.getElementById("app-card-id3");
        const p4 = document.getElementById("app-card-id4");
        this.lines.push(new LeaderLine (p1,p2, {endPlugOutline: false,animOptions: { size:1, duration: 3000,  timing: 'linear' }}));
        this.lines.push(new LeaderLine (p2,p3, {endPlugOutline: false,animOptions: { size:1, duration: 3000, timing: 'linear' }}));
        this.lines.push(new LeaderLine (p2,p4, {endPlugOutline: false,animOptions: { size:1, duration: 3000, timing: 'linear' }}));*/
        this.drawLines();
        },1000);

    });

    /*for (let index = 0; index < 5; index++) {
      let page:any = {
        left: 300+this.getRandomInt(1000),
        top: 200+this.getRandomInt(700),
        width: 320,
        height: 640,
        height_orig: 640,
        page_id: index,
        title: "Page "+this.getRandomInt(20)
      };
      this.pages.push(page);
    }*/
    //console.log(this.pages);

  }

  //redraw lines position
  recalcLines() {
    this.lines.forEach(line => {
      line.position();
    });
  }

  /**
   * Clear all lines
   */
  clearLines() {
    this.lines.forEach(line => {
      console.log(line);
      line.remove();
    });
    this.lines = [];
  }

  ngAfterViewInit() {


  }


  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  /**
   * Move component
   * @param ev coordinates data from component
   */
  layoutMove(ev:any) {

    if (ev.left>0) {
      this.pages[ev.page_index].left = this.pages[ev.page_index].left = ev.left;
      this.recalcLines();
    }else {
      //
      this.recalcLines();
    }
    if (ev.top>0) {
      this.pages[ev.page_index].top = ev.top;
      this.recalcLines(); 
    }else {
      //
      this.recalcLines();
    }
  }
  
  //stop move event
  layoutEndMove(ev:any) {
    this.layoutService.updatePagePos(this.app_id,this.pages[ev.page_index].page_id, this.pages[ev.page_index].left, this.pages[ev.page_index].top, this.pages[ev.page_index].height, this.pages[ev.page_index].width).then( r=>{
    });
    this.recalcLines();
  }

  /**
   * trim layout list in windows
   */
  trimLayoutList() {

    let padding:number = 0;

    //get minimal shift to left

    let minX = this.pages[0].left+padding;
    let minY = this.pages[0].top+padding;

    this.pages.forEach(page => {
      if (page.left+padding < minX) minX = page.left+padding;
      if (page.top+padding < minY) minY = page.top+padding;
    });

    //move all elements to top-left anchor
    this.pages.forEach(page => {
      page.left = page.left - minX;
      page.top = page.top - minY;
    });    
    this.recalcLines();
  }

  //reset scale 
  scaleReset() {
    this.scale = 1;
    setTimeout(()=>{this.recalcLines()},10);
  }

  //increase scale
  scaleMinus() {  
    if (this.scale>=0.4) this.scale = this.scale-0.1;
    setTimeout(()=>{this.recalcLines()},10);
  }

  //decrease scale
  scalePlus() {
    if (this.scale<=1.9)this.scale = this.scale+0.1;
    setTimeout(()=>{this.recalcLines()},10);
  }

  /**
   * Height change event
   * @param ev event from EventEmmiter
   */
   layoutEndResize(ev:any) {
    console.log("layoutEndResize11");
    this.pages.forEach(p => {
      if (p.page_id==ev.page_id) {
        p.height = ev.height;
        ev.page_index = p.page_index;
      }
    });
    this.pages[ev.page_index].height = ev.height;
    //this.pages[ev.page_index].height = 1000;

    console.log(ev);
    console.log(this.pages[ev.page_index]);

    this.layoutService.createActionEvent("updateHeight",{page_id:this.pages[ev.page_index].page_id, height:this.pages[ev.page_index].height});

    this.layoutService.updatePagePos(this.app_id,this.pages[ev.page_index].page_id, this.pages[ev.page_index].left, this.pages[ev.page_index].top, this.pages[ev.page_index].height, this.pages[ev.page_index].width).then( r=>{
      //new page stored
    });
    this.recalcLines();
    this.ref.detectChanges();
  }


  /**
   * Scroll to center layouts
   */
  centerLayoutList() {
    let minX =999999;
    let maxX =0;
    let minY =999999;
    let maxY =0;
    this.pages.forEach(page => {
      
      if (page.left<minX) minX = page.left;
      if (page.left+page.width>maxX) maxX = page.left+page.width;
      if (page.top<minY) minY = page.top;
      if (page.top+page.height>maxY) maxY = page.top+page.height;
    });

    let centerX = (maxX-minX) / 2 ;
    let centerY = (maxY-minY) / 2 ;

    //scroll to center
    window.scrollTo({left: centerX, top:centerY});
    this.recalcLines();
  }


  /**
   * add page tp layouts
   * @param type string type of page
   */
  addPage(name:string="Page", type:string = "blank") {
    
    console.log("add page on list");

    //
    let maxX =0;
    let minY =999999;
    this.pages.forEach(page => {
      if (page.left+page.width>maxX) maxX = page.left+page.width;
      if (page.top<minY) minY = page.top;
    });

    let array_pos = this.pages.length;
    let page:any = {
      left: maxX+50,
      top: minY,
      //width: 320,
      width: 375,
      height: 640,
      height_orig: 640,
      page_id: 0,
      page_index: array_pos,
      type: type,
      name: name,
      title: name,
      can_delete: 1,
      selected: 0,
    };   

    //Add page to core and return resul
    this.layoutService.addPage(this.app_id, name, type, page.left, page.top, page.height, page.width).then( response=>{
      console.log("add page request");
      console.log(response);
      page.page_id = response.page.id;
      window.scrollTo({left: page.left+100, top:page.top});
      this.pages.push(page);
      this.selectPage(page);
//      this.selectPage = page.page_id;
//      console.log(page.page_id);
//      this.loadPageComponents(this.selected_page);
//      this.ref.detectChanges();
    });

  }

  //Change component list panel state
  showSideComponent(): string {
    this.componentMenuState=="true"?this.componentMenuState="false":this.componentMenuState="true";
    return this.componentMenuState;
    //this.componentDeleteFormMenuState=="true"?this.componentDeleteFormMenuState="false":this.componentDeleteFormMenuState="true";
    //return this.componentMenuState;

  }  


  //Change delete form panel state
  showSidePageDeleteForm(): string {
    this.componentDeleteFormMenuState=="true"?this.componentDeleteFormMenuState="false":this.componentDeleteFormMenuState="true";
    return this.componentMenuState;
  }  

  // close delete form side
  closeDeleteFormSide(ev:any) {
    this.componentDeleteFormMenuState="false";
  }

  //close page settings form side
  closeSettingsFormSide(ev:any) {
    this.componentSettingsFormMenuState="false";
  }

  /**
   * delete button on page-card clicked
   * @param ev event
   */
  layoutDeletePageClicked(ev:any) {
    console.log("delete clicked");
    console.log(ev);
    this.page_id_for_delete = ev.page_id;
    this.page_name_for_delete = ev.page_name;
    this.componentMenuState="false";
    this.componentSettingsFormMenuState="false";
    this.componentDeleteFormMenuState="true";
  }

  /**
   * delete button on page-card clicked
   * @param ev event
   */
   layoutOpenSettingsPageClicked(ev:any) {
    console.log("settings clicked");
    console.log(ev);
    this.page_id_for_delete = ev.page_id;
    this.page_name_for_delete = ev.page_name;
    this.componentMenuState="false";
    this.componentDeleteFormMenuState="false";
    this.componentSettingsFormMenuState="true";
    
  }

  /**
   * Remove page from core, than from pages array
   * @param ev Event data
   */
  doDeletePage(ev:any) {
    console.log(ev);
    this.componentMenuState="false";
    this.componentDeleteFormMenuState="false";    
    this.componentSettingsFormMenuState="false";    
    this.layoutService.removePage(this.app_id, ev.page_id).then( result => {
      console.log("page deletion result:");
      console.log(result);

      //remove page from pages array
      this.pages = this.pages.filter(page => page.page_id!=ev.page_id);
      this.ref.detectChanges();
    });
  }


  mouseenter(page:any) {
    console.log("mouseenter");
    console.log(page.name);
    let Xmin: number = parseInt(page.left);
    let Xmax: number = parseInt(page.left)+parseInt(page.width);
    let Ymin: number = parseInt(page.top);
    let Ymax: number = parseInt(page.top)+parseInt(page.height);
    //console.log("Xmin="+Xmin+" Xmax="+Xmax);
    //console.log("Ymin="+Ymin+" Ymax="+Ymax);

    //console.log(this.appcards);
    this.appcards.forEach((el)=>{
      
      if (el.nativeElement.id=="app-card-id"+page.page_id) {
        let datas = el.nativeElement.getBoundingClientRect();
        //console.log("datas = ", datas);
        //console.log(el.nativeElement.id);
      }
    });
  }

  mouseleave(page:any) {
    //console.log("mouseleave");
    //console.log(page.name);
  }

  layoutDropComponentEvent(ev:any,page) {
    if (this.drag_process) {
      console.log("Component dropped in "+page.name);
      //console.log(page);
      //console.log(ev);

      let x = ev.layerX;
      let y = ev.layerY;
      
      //round x and y
      
      //if dropp in not ion-content, get parent
      let target:any  = ev.target || ev.srcElement;

      //find the ion-content and get scroll position
      let ion_content = target;
      if (ion_content.tagName!="ION-CONTENT")  {
        let deep_counter = 20;
        while (ion_content.tagName!="ION-CONTENT") {
          ion_content = target.parentElement;
          deep_counter--;
          if (deep_counter==0) {return;}
        }
      }
      if (target!== undefined) {

      } else {
        // otherwise return value to target
        ion_content = target;
      }


      var rect = target.getBoundingClientRect();
      var x1 = ev.clientX - rect.left; //x position within the element.
      var y1 = ev.clientY - rect.top;  //y position within the element.

      x =  Math.round(x1  / this.scale);
      y =  Math.round(y1  / this.scale);

      if (target.tagName!="ION-CONTENT")  {
        
        var rect = ion_content.getBoundingClientRect();
        var x1 = ev.clientX - rect.left; //x position within the element.
        var y1 = ev.clientY - rect.top;  //y position within the element.
        //console.log("Scale? : " + this.scale + "Left? : " + x1 + " ; Top? : " + y1 + ".");
  
        x =  Math.round(x1  / this.scale);
        y =  Math.round(y1  / this.scale);          
      } else {
        //fix X and Y shift

      }
      
      //console.log(target);
      //console.log(target.tagName);

      //round x and y
      x = Math.ceil(x/5)*5;
      y = Math.ceil(y/5)*5;
      
      //add this values to component
      this.dragged_component.x = x;
      this.dragged_component.y = y;

      this.dragged_component.x0 = x;
      this.dragged_component.y0 = y;
      this.dragged_component.from_left_to_x0 = y;
      this.dragged_component.from_top_to_y0 = y;


      //console.log(page);
      const {image,svg, ...component} = this.dragged_component;
      //console.log(component);
      
      //store component to core
      this.layoutService.addPageComponent(this.app_id,page.page_id, component).then (result=>{
        console.log("Component added to "+page.name);

        //get reload page from core
        this.layoutService.createActionEvent("pageNeedToRestore",{page_id: page.page_id})
      });
    }
  }

  /**
   * Event on click on page
   * @param page page data
   */
  selectPage(page:any) {
    //console.log("selectPage");
    //console.log(page);
    this.pages.forEach(p => {
      p.selected = false;
    });
    if (this.selected_page != page.page_id) this.componentComponentFormMenuState="false";
    this.selected_page = page.page_id;
    this.selected_page_full = page;
    page.selected = true;
    this.loadPageComponents(page.page_id);
    
  }


  /**
   * Load page components from core
   * @param page_id page id
   */
  async loadPageComponents(page_id) {
    this.layoutService.getPageComponents(this.app_id,page_id).then(res=> {
      this.component_list = res;
      this.ref.detectChanges();
      //this.addComponentClickListeners();
    });
  }

  /**
   * show component form
   * @param component component data
   * @param index position in components aray
   */
  showComponentForm(component:any, index:number) {
    this.layoutService.createActionEvent("openComponentForm", {page: this.selected_page_full, component:component});
    //console.log(component);
    //console.log(index);
    this.componentComponentFormMenuState=="true"?this.componentComponentFormMenuState="false":this.componentComponentFormMenuState="true";
    return this.componentComponentFormMenuState;
  }


  /**
   * deletre component from list
   * @param c component data
   */
  deleteComponentFromPage(c:any) {
    this.layoutService.deleteComponentFromPage(this.app_id, c.id).then(res=> {
      this.component_list = res;
      //this.selected_page
      this.layoutService.createActionEvent("pageNeedToRestore",{page_id: this.selected_page});
      this.ref.detectChanges();
    });
  }

  /**
   * Draw leader line
   */
  drawLines() {
    this.lines = [];
  
    this.layoutService.getLines(this.app_id).then( res=>{
      console.log("drawLines");
      console.log(res);
      res.forEach(element => {
        if (element.relations.length>0) {
          const p1 = document.getElementById("app-card-id"+element.id);
          element.relations.forEach(rel => {
            if (element.id!=rel) {
              const p2 = document.getElementById("app-card-id"+rel);
              console.log(p1+ " " + p2);
              console.log(element.id+ " " + rel);
              this.lines.push(new LeaderLine (p1,p2, {endPlugOutline: false,animOptions: { size:1, duration: 3000,  timing: 'linear' }}));
            }
          });
        }
      });
    });

    /*const p1 = document.getElementById("app-card-id1");
    const p2 = document.getElementById("app-card-id2");
    const p3 = document.getElementById("app-card-id3");
    const p4 = document.getElementById("app-card-id4");
    this.lines.push(new LeaderLine (p1,p2, {endPlugOutline: false,animOptions: { size:1, duration: 3000,  timing: 'linear' }}));
    this.lines.push(new LeaderLine (p2,p3, {endPlugOutline: false,animOptions: { size:1, duration: 3000, timing: 'linear' }}));
    this.lines.push(new LeaderLine (p2,p4, {endPlugOutline: false,animOptions: { size:1, duration: 3000, timing: 'linear' }}));*/
  }


  offset(el) {
    var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
  }

}

