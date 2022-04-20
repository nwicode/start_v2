import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {ApplicationService} from '../../../services/application.service'
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-android-mockup',
  templateUrl: './android-mockup.component.html',
  styleUrls: ['./android-mockup.component.scss']
})
export class AndroidMockupComponent implements OnInit {


  was_loaded:boolean = false;
  application:any;
  app_id:number;

  //arrays for demo
  text_color: string = "";
  bg_color: string = "";
  background_image_mode: string = "";
  background_image_size: string = "";
  background_image: string = "";
  system_colors:any[] = [];
  user_colors:any[] = [];
  additional_colors:any[] = [];


  constructor(private ref: ChangeDetectorRef, private router: Router, private applicationService:ApplicationService) { }

  ngOnInit(): void {

    this.applicationService.onMokupEvent().subscribe( event => {
      console.log(event);
      if (event.event=="changeEvent") {
        this.applyChanges(event.data);
        this.ref.detectChanges();
      } else if (event.event=="resetEvent") {
        this.reloadChanges();
      }
    });

    this.app_id = Number(this.router.url.match(/constructor\/(\d+)/)[1]);

    this.applicationService.getApplicationById(this.app_id).then(response => {

      console.log(response);
      if (!response.is_error) {
        this.application = response;

        this.applyChanges(this.application);
      }
      this.was_loaded = true;

      this.addFonts(environment.apiUrl + 'storage/application/' + response.id + '-' + response.unique_string_id + '/fonts');

      this.ref.detectChanges();
    });

  }


  applyChanges(application) {
    this.additional_colors = [];
    this.system_colors = [];
    this.user_colors = [];

    if (application.background_image.includes('data:image')) this.background_image = application.background_image; else   this.background_image = environment.apiUrl + "storage/application/" + application.id + "-" + application.unique_string_id + '/resources/' + application.background_image;
    this.background_image_size = application.background_image_size;
    this.background_image_mode = application.background_image_mode;

    for(let color in application.colors) {
      if ( application.colors[color].color_name== "--ion-background-color") this.bg_color = application.colors[color].color_value;
      else if ( application.colors[color].color_name== "--ion-text-color") this.text_color = application.colors[color].color_value;
      else if (application.colors[color].color_type=="system" && application.colors[color].named) this.system_colors.push(application.colors[color]);
      else if (application.colors[color].color_type=="user" && application.colors[color].named) this.user_colors.push(application.colors[color]);
      else if (application.colors[color].color_type=="system" && !application.colors[color].named) this.additional_colors.push(application.colors[color]);
    }    
  }


  reloadChanges() {
    this.was_loaded = false;
    this.applicationService.getApplicationById(this.app_id).then(response => {

      console.log(response);
      if (!response.is_error) {
        this.application = response;

        this.applyChanges(this.application);
      }
      this.was_loaded = true;
      this.ref.detectChanges();
    });    
  }

  addFonts(url) {
    this.applicationService.getApplicationFonts(this.app_id).then(response => {
      let fontsConnections = response.fontsConnections;
      let styles = '';
      for (let i = 0; i < fontsConnections.length; i++) {
        styles += fontsConnections[i] + '\n';
      }
      styles = styles.replace(new RegExp('\.\./fonts', 'g'), url);

      const node = document.createElement('style');
      node.innerHTML = styles;
      document.body.appendChild(node);

      this.ref.detectChanges();
    });
  }
}
