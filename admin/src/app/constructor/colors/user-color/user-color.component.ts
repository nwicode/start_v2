import { Component, OnInit, ElementRef, HostListener, } from '@angular/core';
import { SubheaderService } from '../../ConstructorComponents/subheader/_services/subheader.service';
import {Observable, Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {ApplicationService} from '../../../services/application.service'
import { ActivatedRoute, Router } from '@angular/router';
import {TranslationService} from "../../../services/translation.service";
import {ToastService} from '../../../platform/framework/core/services/toast.service';

@Component({
  selector: 'app-user-color',
  templateUrl: './user-color.component.html',
  styleUrls: ['./user-color.component.scss']
})
export class UserColorComponent implements OnInit {

  isLoading$: Observable<boolean>;
  was_changed: boolean = false;
  loaded: boolean = false;
  new_color_picker: boolean = false;
  inside: boolean = false;
  app_id: number;

  new_color:string = "#ffffff";

  colors_array:any[] = [];
  removed_colors_array:any[] = [];
  application:any;
  default_color:any;

  displayColorPicker: boolean = false;

  constructor(private translationService: TranslationService, private router: Router, private toastService: ToastService, private activateRoute: ActivatedRoute, private subheader: SubheaderService, private eRef: ElementRef, private applicationService:ApplicationService) { }

  ngOnInit(): void {
    this.app_id = Number(this.router.url.match(/constructor\/(\d+)/)[1]);

    setTimeout(() => {
      this.subheader.setTitle('CONSTRUCTOR.COLORS.USER_COLORS');
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
        
        //Create colors array with ionic colors
        this.colors_array = [];
        this.removed_colors_array = [];
        for (let key in data.colors) {
          data.colors[key].confirm = false;
          data.colors[key].new = false; //new color marker
          if (data.colors[key].color_name=="--ion-color-primary") this.default_color = data.colors[key];  //use primary as default color
          if (data.colors[key].color_type=="user" && data.colors[key].disabled==0) this.colors_array.push(data.colors[key]);
        }

        this.applicationService.getApplicationById(this.app_id).then(response => {
          if (!response.is_error) {
            this.application = response;
          }
          this.loaded = true;
          observer.next(false);
        });


      }).finally( ()=>{
        //observer.next(false);
      });
    });        
  }

  /**
   * add new color item in array
   */
  addColor() {
    let new_color = Object.assign({}, this.default_color);
    let rnd = (Math.floor(Math.random() * (99999 - 1000 + 1)) + 1000).toString();
    new_color.color_name = "--ion-color-color"+rnd;
    new_color.letter = "";
    new_color.picker = false;
    new_color.new = true;
    new_color.color_type = "user";
    new_color.name = "Color " + rnd;
    new_color.named = "color"+rnd;
    new_color.disabled = false;
    this.colors_array.unshift(new_color);
    this.was_changed = true;
    this.application.colors[new_color.color_name] = new_color;
    this.applicationService.createMokupEvent("changeEvent",this.application);    
  }

  /**
   * Store colors to core
   */
   save() {
    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);

      //combine color array and removed array with one before sending
      let combined_colors_array = this.colors_array.concat(this.removed_colors_array);

      combined_colors_array.forEach(color => {
        if (color.named=="") color.named = color.name;
      });
      this.applicationService.setApplicationColors(this.app_id, combined_colors_array).then( (response) =>{

        if (response.is_error) {
          this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_NOT_SAVED'), 'warning');
        } else {
          this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_SAVED'), 'success');
        }
      }).catch (err =>{
        this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_NOT_SAVED'), 'warning');
      })
      .finally( ()=>{
        observer.next(false);
        this.was_changed = false;
      });

    });
  }

  cancel() {


    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      this.applicationService.getApplicationColors(this.app_id).then(data=>{
        console.log("colors");
        console.log(data.colors);
        
        //Create colors array with ionic colors
        this.colors_array = [];
        this.removed_colors_array = [];
        for (let key in data.colors) {
          data.colors[key].confirm = false;
          if (data.colors[key].color_type=="user") this.colors_array.push(data.colors[key]);
        }
        this.loaded = true;
        observer.next(false);
        this.applicationService.createMokupEvent("resetEvent",{});
      }).finally( ()=>{
        //observer.next(false);
      });
    }); 
  }

  /**
   * Change color in colorpicker event
   * @param event change color event data from color picker
   * @param color 
   */
   changeColorEvent(event:any, color:any) {
    this.was_changed = true;
    color.color_value = event.hex;
    console.log(color);
    this.application.colors[color.color_name].color_value = event.hex;
    this.applicationService.createMokupEvent("changeEvent",this.application);   
  }  


  /**
   * Remove color from color array and add it to remove_color array
   * @param color 
   */
  removeColor(color:any,i:number) {
    color.confirm = false;
    console.log(i);
    color.disabled = 1;

    let deleted_color = Object.assign({}, color);

    this.colors_array.splice(i,1);
    console.log(i);
    console.log(this.colors_array);
    this.was_changed = true;
    this.removed_colors_array.push(deleted_color);
    delete this.application.colors[deleted_color.color_name];
    this.applicationService.createMokupEvent("changeEvent",this.application);
  }
}
