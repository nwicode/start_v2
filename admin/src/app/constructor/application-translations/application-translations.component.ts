import { Component, OnInit } from '@angular/core';
import { SubheaderService } from '../ConstructorComponents/subheader/_services/subheader.service';
import {Observable, Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {ApplicationService} from '../../services/application.service'
import { ActivatedRoute, Router } from '@angular/router';
import {TranslationService} from "../../services/translation.service";
import {ToastService} from '../../platform/framework/core/services/toast.service';

@Component({
  selector: 'app-application-translations',
  templateUrl: './application-translations.component.html',
  styleUrls: ['./application-translations.component.scss']
})
export class ApplicationTranslationsComponent implements OnInit {

  isLoading$: Observable<boolean>;
  app_id: number;
  was_changed:boolean = false;
  new_opened:boolean = false;  
  translations: any = [];

  constructor(private translationService: TranslationService, private router: Router, private toastService: ToastService, private activateRoute: ActivatedRoute, private subheader: SubheaderService, private applicationService:ApplicationService) { }

  ngOnInit(): void {

    this.app_id = Number(this.router.url.match(/constructor\/(\d+)/)[1]);
    setTimeout(() => {
      this.subheader.setTitle('CONSTRUCTOR.TRANSLATIONS.TITLE');
    }, 1);    
  

    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      this.applicationService.getApplicationTranlsation(this.app_id).then(data=>{
        //console.log(data)
        this.translations = data;
        observer.next(false);
      }).finally( ()=>{
        //observer.next(false);
      });
    }); 

  }

  translationRows(){
    let phrases:any = [];
    this.translations.forEach((translation,ti) => {
      //console.log(translation);
      for (let entry in translation.items) {
        //console.log(entry);
        
        let item: any = {
          code: entry,
          items:[]
        }

        this.translations.forEach(t => {
          for (let e in t.items) {
            if (entry==e) item.items.push(t.items[e]);
          }
        });

        
        if (ti==0) phrases.push(item);
      }
      
    });
    console.log(phrases);
    return phrases;
  }

  getTranslation(i:number, i1:number) {
    return this.translations[i].language;
  }


  onChangeEvent(event:any, code:any, i1:any) {
    this.translations[i1].items[code] = event.target.value;
    this.was_changed = true;
  }

  save() {
    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      this.applicationService.setApplicationTranlsation(this.app_id,this.translations).then(response=>{
        if (response.is_error) {
          this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_NOT_SAVED'), 'danger');
        } else {
          this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_SAVED'), 'success');
        }        
        observer.next(false);
        this.was_changed = false;
      }).finally( ()=>{
        //observer.next(false);
      });
    }); 
  }

  cancel() {
    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      this.applicationService.getApplicationTranlsation(this.app_id).then(data=>{
        //console.log(data)
        this.translations = data;
        observer.next(false);
        this.was_changed = false;
      }).finally( ()=>{
        //observer.next(false);
      });
    }); 
  }

}
