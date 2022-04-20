import { Component, OnInit, ElementRef, HostListener, } from '@angular/core';
import { SubheaderService } from '../../ConstructorComponents/subheader/_services/subheader.service';
import {Observable, Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {ApplicationService} from '../../../services/application.service'
import { ActivatedRoute, Router } from '@angular/router';
import {TranslationService} from "../../../services/translation.service";
import {ToastService} from '../../../platform/framework/core/services/toast.service';

@Component({
  selector: 'app-additional-color',
  templateUrl: './additional-color.component.html',
  styleUrls: ['./additional-color.component.scss']
})
export class AdditionalColorComponent implements OnInit {

  isLoading$: Observable<boolean>;
  was_changed: boolean = false;
  inside: boolean = false;
  app_id: number;

  fore_color:string = "#000";
  bg_color:string = "#fff";

  custom_color1:string = "#FF0000";
  custom_color2:string = "#0000FF";

  custom_color1_picker:boolean = false;
  custom_color2_picker:boolean = false;

  colors_array:any[] = [];

  constructor(private translationService: TranslationService, private router: Router, private toastService: ToastService, private activateRoute: ActivatedRoute, private subheader: SubheaderService, private eRef: ElementRef, private applicationService:ApplicationService) { }

  ngOnInit(): void {

    this.app_id = Number(this.router.url.match(/constructor\/(\d+)/)[1]);   

    setTimeout(() => {
      this.subheader.setTitle('CONSTRUCTOR.COLORS.ADDITIONAL_COLORS');
      this.subheader.setBreadcrumbs([{
        title: 'CONSTRUCTOR.COLORS.TITLE',
        linkText: 'CONSTRUCTOR.COLORS.TITLE',
        linkPath: 'constructor/'+this.app_id+'/colors/'
      }]);
    }, 1);

 
    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      this.applicationService.getApplicationColors(this.app_id).then(data=>{
        console.log("colors");
        console.log(data.colors);
        
        //Create colors array with ionic colors
        this.colors_array = [];
        this.fore_color = data.colors['--ion-text-color'].color_value;
        this.bg_color = data.colors['--ion-background-color'].color_value;        
        for (let key in data.colors) {
          if (
            data.colors[key].named!="primary" &&
            data.colors[key].named!="secondary" &&
            data.colors[key].named!="success" &&
            data.colors[key].named!="danger" &&
            data.colors[key].named!="warning" &&
            data.colors[key].named!="dark" &&
            data.colors[key].named!="medium" &&
            data.colors[key].named!="light" &&
            data.colors[key].named!="tertiary" &&
            data.colors[key].color_type=="system" &&
            data.colors[key].color_name!="--ion-text-color" &&
            data.colors[key].color_name!="--ion-background-color"
          ) this.colors_array.push(data.colors[key]);
        }
        observer.next(false);
      }).finally( ()=>{
        //observer.next(false);
      });
    });      
  }


    /**
   * Store colors to core
   */
     save() {
      this.isLoading$ = new Observable<boolean>(observer => {
        observer.next(true);
  
        this.applicationService.setApplicationColors(this.app_id, this.colors_array).then( (response) =>{
          if (response.is_error) {
            this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_NOT_SAVED'), 'warning');
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
          //Create colors array with ionic colors
          this.colors_array = [];
          this.fore_color = data.colors['--ion-text-color'].color_value;
          this.bg_color = data.colors['--ion-background-color'].color_value;          
          for (let key in data.colors) {
            data.colors[key].picker = false;


            if (
              data.colors[key].named!="primary" &&
              data.colors[key].named!="secondary" &&
              data.colors[key].named!="success" &&
              data.colors[key].named!="danger" &&
              data.colors[key].named!="warning" &&
              data.colors[key].named!="dark" &&
              data.colors[key].named!="medium" &&
              data.colors[key].named!="light" &&
              data.colors[key].named!="tertiary" &&
              data.colors[key].color_type=="system" &&
              data.colors[key].color_name!="--ion-text-color" &&
              data.colors[key].color_name!="--ion-background-color"
            ) this.colors_array.push(data.colors[key]);
          }
          observer.next(false);
        }).finally( ()=>{
          //observer.next(false);
        });
      });
    }
  
    /**
     * open colorpicker and change color
     * @param color color item
     */
    changeColor(color:any){
      console.log(color);
    }
  
  
    /**
     * Change color in colorpicker event
     * @param event change color event data from color picker
     * @param color 
     */
    changeColorEvent(event:any, color:any) {
      this.was_changed = true;
      color.color_value = event.hex;
    }  
  
    /**
     * Change custom color 1 and 2
     * @param event change color event data from color picker
     * @param color 1 or 2 - color id
     */
     changeCustomColorEvent(event:any, color:number) {
      this.was_changed = true;
      if (color==1) this.custom_color1 = event.hex;
      else if (color==2) this.custom_color2 = event.hex;
    }


    generateStepped(mode: number) {
      let color1 = this.fore_color;
      let color2 = this.bg_color;

      if (mode==2) {
        color1 = this.custom_color1;
        color2 = this.custom_color2;
      }

      let colors = this.generateColor(color2, color1,28);

      let i = 0;
      this.colors_array.forEach(color => {
        if (color.color_name=="--ion-color-step-950") color.color_value = '#'+colors[0];
        if (color.color_name=="--ion-color-step-900") color.color_value = '#'+colors[1];
        if (color.color_name=="--ion-color-step-850") color.color_value = '#'+colors[2];
        if (color.color_name=="--ion-color-step-800") color.color_value = '#'+colors[3];
        if (color.color_name=="--ion-color-step-750") color.color_value = '#'+colors[4];
        if (color.color_name=="--ion-color-step-700") color.color_value = '#'+colors[5];
        if (color.color_name=="--ion-color-step-650") color.color_value = '#'+colors[6];
        if (color.color_name=="--ion-color-step-600") color.color_value = '#'+colors[7];
        if (color.color_name=="--ion-color-step-550") color.color_value = '#'+colors[8];
        if (color.color_name=="--ion-color-step-500") color.color_value = '#'+colors[9];
        if (color.color_name=="--ion-color-step-450") color.color_value = '#'+colors[10];
        if (color.color_name=="--ion-color-step-400") color.color_value = '#'+colors[11];
        if (color.color_name=="--ion-color-step-350") color.color_value = '#'+colors[21];
        if (color.color_name=="--ion-color-step-300") color.color_value = '#'+colors[22];
        if (color.color_name=="--ion-color-step-250") color.color_value = '#'+colors[23];
        if (color.color_name=="--ion-color-step-200") color.color_value = '#'+colors[24];
        if (color.color_name=="--ion-color-step-150") color.color_value = '#'+colors[25];
        if (color.color_name=="--ion-color-step-100") color.color_value = '#'+colors[26];
        if (color.color_name=="--ion-color-step-50") color.color_value = '#'+colors[27];
      });

      console.log(colors);
    }

    hex (c) {
      var s = "0123456789abcdef";
      var i = parseInt (c);
      if (i == 0 || isNaN (c))
        return "00";
      i = Math.round (Math.min (Math.max (0, i), 255));
      return s.charAt ((i - i % 16) / 16) + s.charAt (i % 16);
    }
    
    /* Convert an RGB triplet to a hex string */
    convertToHex (rgb) {
      return this.hex(rgb[0]) + this.hex(rgb[1]) + this.hex(rgb[2]);
    }
    
    /* Remove '#' in color hex string */
    trim (s) { return (s.charAt(0) == '#') ? s.substring(1, 7) : s }
    
    /* Convert a hex string to an RGB triplet */
    convertToRGB (hex) {
      var color = [];
      color[0] = parseInt ((this.trim(hex)).substring (0, 2), 16);
      color[1] = parseInt ((this.trim(hex)).substring (2, 4), 16);
      color[2] = parseInt ((this.trim(hex)).substring (4, 6), 16);
      return color;
    }    

    generateColor(colorStart,colorEnd,colorCount){

      // The beginning of your gradient
      var start = this.convertToRGB (colorStart);    
    
      // The end of your gradient
      var end   = this.convertToRGB (colorEnd);    
    
      // The number of colors to compute
      var len = colorCount;
    
      //Alpha blending amount
      var alpha = 0.0;
    
      var saida = [];
      
      for (let i = 0; i < len; i++) {
        var c = [];
        alpha += (1.0/len);
        
        c[0] = start[0] * alpha + (1 - alpha) * end[0];
        c[1] = start[1] * alpha + (1 - alpha) * end[1];
        c[2] = start[2] * alpha + (1 - alpha) * end[2];
    
        saida.push(this.convertToHex (c));
        
      }
      
      return saida;
    }


}
