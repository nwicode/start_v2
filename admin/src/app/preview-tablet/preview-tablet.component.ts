import {ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {DOCUMENT} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {ApplicationService} from "../services/application.service";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-priview-tablet',
  templateUrl: './preview-tablet.component.html',
  styleUrls: ['./preview-tablet.component.scss']
})
export class PreviewTabletComponent implements OnInit {

  is_loaded: boolean = false;
  is_updated: boolean = true;
  url:SafeResourceUrl;
  app_id:any;
  url_app:string = "";
  source_date:string = "";
  url_app_copy:string = "";

  @ViewChild('iframe', {static: false}) iframe: ElementRef;

  constructor(@Inject(DOCUMENT) document, private activateRoute: ActivatedRoute, private ref: ChangeDetectorRef, private sanitizer: DomSanitizer, private applicationService:ApplicationService) {
    this.app_id = activateRoute.snapshot.params['app_id'];
    console.log("app_id");
    console.log(this.app_id);
  }

  ngOnInit(): void {
    this.getData();

    this.applicationService.onMokupEvent().subscribe(data =>{
      console.log("Preview event");
      console.log(data);
    })

  }

  getData() {
    //get app and create preview url
    this.applicationService.getApplicationById(this.app_id).then( result=> {
      console.log(result);
      this.url_app = environment.apiUrl+"storage/application/"+result.id+"-"+result.unique_string_id+"/sources/www/";
      this.url_app_copy = this.url_app_copy;
      console.log("Preview url is "+this.url_app);
      if (!result.www_updating_in_query && !result.www_updating_now) {
        this.source_date = 'ok';

        //set timeout to another check
        this.is_updated = true;
        setTimeout( ()=>{
          this.getDataSilent();
        },5000);


      } else if (result.www_updating_in_query || result.www_updating_now) {
        this.source_date = 'wait';
        this.url_app = "";
        this.is_updated = false;
        //set timeout to another check
        setTimeout( ()=>{
          this.getDataSilent();
        },5000);

      }


      this.is_loaded = true;
      this.ref.detectChanges();
    });
  }

  getDataSilent() {
    //get app and create preview url
    this.applicationService.getApplicationById(this.app_id).then( result=> {

      let need_to_reload: boolean = false;



      if (!result.www_updating_in_query && !result.www_updating_now) {
        if (this.source_date!='ok') need_to_reload = true;
        this.source_date = 'ok';
        this.is_updated = true;
        if (need_to_reload) {
          this.ref.detectChanges();
        }

        //set timeout to another check
        setTimeout( ()=>{
          this.getDataSilent();
        },5000);

      } else if (result.www_updating_in_query || result.www_updating_now) {
        if (this.source_date!='wait') need_to_reload = true;

        this.source_date = 'wait';
        this.is_updated = false;

        if (need_to_reload) {
          this.ref.detectChanges();
        }

        //set timeout to another check
        setTimeout( ()=>{
          this.getDataSilent();
        },5000);
      }
      //this.ref.detectChanges();
    });
  }

  protoURL(){
    return  this.sanitizer.bypassSecurityTrustResourceUrl(this.url_app);
  }


  iframeLoaded() {
    //this.is_loaded = true;
    //this.ref.detectChanges();
  }

  refresh() {
    this.is_loaded = false;
    this.getData();
  }

  rebuild() {
    this.applicationService.rebuildRequest(this.app_id).then( result=> {
      this.getDataSilent();
    });
  }

}
