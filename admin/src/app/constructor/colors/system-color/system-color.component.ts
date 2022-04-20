import { Component, OnInit, ElementRef, HostListener, } from '@angular/core';
import { SubheaderService } from '../../ConstructorComponents/subheader/_services/subheader.service';
import {Observable, Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {ApplicationService} from '../../../services/application.service'
import { ActivatedRoute, Router } from '@angular/router';
import {TranslationService} from "../../../services/translation.service";
import {ToastService} from '../../../platform/framework/core/services/toast.service';

@Component({
  selector: 'app-system-color',
  templateUrl: './system-color.component.html',
  styleUrls: ['./system-color.component.scss']
})
export class SystemColorComponent implements OnInit {

  isLoading$: Observable<boolean>;
  was_changed: boolean = false;
  inside: boolean = false;
  app_id: number;
  application: any;


  colors_array:any[] = [];

  displayColorPicker: boolean = false;

  constructor(private translationService: TranslationService, private router: Router, private toastService: ToastService, private activateRoute: ActivatedRoute, private subheader: SubheaderService, private eRef: ElementRef, private applicationService:ApplicationService) { }

  ngOnInit(): void {
    this.app_id = Number(this.router.url.match(/constructor\/(\d+)/)[1]);
    setTimeout(() => {
      this.subheader.setTitle('CONSTRUCTOR.COLORS.SYSTEM_COLORS');
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
        
        //Create colors array with ionic colors
        this.colors_array = [];
        for (let key in data.colors) {
          if (
            data.colors[key].named=="primary" ||
            data.colors[key].named=="secondary" ||
            data.colors[key].named=="success" ||
            data.colors[key].named=="danger" ||
            data.colors[key].named=="warning" ||
            data.colors[key].named=="dark" ||
            data.colors[key].named=="medium" ||
            data.colors[key].named=="light" ||
            data.colors[key].named=="tertiary"
          ) this.colors_array.push(data.colors[key]);
        }
        //observer.next(false);
        this.applicationService.getApplicationById(this.app_id).then(response => {
          if (!response.is_error) {
            this.application = response;
          }
          observer.next(false);
        });

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
          this.was_changed = false;
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

        //Create colors array with ionic colors
        this.colors_array = [];
        for (let key in data.colors) {
          data.colors[key].picker = false;
          if (
            data.colors[key].named=="primary" ||
            data.colors[key].named=="secondary" ||
            data.colors[key].named=="success" ||
            data.colors[key].named=="danger" ||
            data.colors[key].named=="warning" ||
            data.colors[key].named=="dark" ||
            data.colors[key].named=="medium" ||
            data.colors[key].named=="light" ||
            data.colors[key].named=="tertiary"
          ) this.colors_array.push(data.colors[key]);
        }
        observer.next(false);
        this.applicationService.createMokupEvent("resetEvent",{});
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

    this.application.colors[color.color_name].color_value = color.color_value;

    this.applicationService.createMokupEvent("changeEvent",this.application);
  }




}
