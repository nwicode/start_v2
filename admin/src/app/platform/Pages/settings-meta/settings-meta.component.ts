import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import {ToastService} from '../../framework/core/services/toast.service';
import { SubheaderService } from '../../LayoutsComponents/subheader/_services/subheader.service';
import { TranslationService } from '../../../services/translation.service';
import { ContentService } from '../../../services/content.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-settings-meta',
  templateUrl: './settings-meta.component.html',
  styleUrls: ['./settings-meta.component.scss']
})
export class SettingsMetaComponent implements OnInit {

  isLoading$: Observable<boolean>;

  pages:any[] = [];
  currentAppLanguage: string;

  selectedIndex = 0;
  metas:any[] = [];
  default_meta:any = {};

  constructor(private route: ActivatedRoute, private contentService: ContentService,
    private translationService: TranslationService, private subheader: SubheaderService,private toastService: ToastService, private fb: FormBuilder, ) { }

  ngOnInit(): void {


    this.currentAppLanguage = this.translationService.getSelectedLanguage();
    
    this.selectedIndex = 0;    

    setTimeout(() => {
      this.subheader.setTitle('PAGE.SETTINGS_META.TITLE');
      this.subheader.setBreadcrumbs([{
        title: 'PAGE.SETTINGS_META.TITLE',
        linkText: 'PAGE.SETTINGS_META.TITLE',
        linkPath: '/settings-meta'
      }]);
    }, 1); 
    
    
    this.isLoading$ = new Observable<boolean>( observer => {
      observer.next(true);
      
      
      this.contentService.downloadStaticPages(['META_TITLE','META_DESCRIPTION']).then(response => {


        //parse response and fill settings
        response.forEach(language_items => {
          let page: any  = {};          
          page.code = language_items[0].code;
          language_items.forEach(el => {
            if (el.pageCode=='META_TITLE') page.META_TITLE = el.content;
            if (el.pageCode=='META_DESCRIPTION') page.META_DESCRIPTION = el.content;
          });
          this.pages.push(page);

        });
        
        console.log(this.pages);
        observer.next(false);
      });
    });

  }

  /**
   * create data array and sent this array to static pages controller on core
   */
  save() {
    console.log(this.pages);
    this.isLoading$ = new Observable<boolean>( observer => {
      observer.next(true);
      this.contentService.updateMetas(this.pages).then (response => {
        console.log(response);
        if (response.is_error) {
          this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_NOT_SAVED'), 'danger');
        } else {
          this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_SAVED'), 'success');
        }
      }).finally( ()=>{
        observer.next(false);
      });
    });
  }

  /**
   * reload form
   */
  cancel() {
    this.isLoading$ = new Observable<boolean>( observer => {
      observer.next(true);
      
      
      this.contentService.downloadStaticPages(['META_TITLE','META_DESCRIPTION']).then(response => {


        //parse response and fill settings
        this.pages = [];
        response.forEach(language_items => {
          let page: any  = {};          
          page.code = language_items[0].code;
          language_items.forEach(el => {
            if (el.pageCode=='META_TITLE') page.META_TITLE = el.content;
            if (el.pageCode=='META_DESCRIPTION') page.META_DESCRIPTION = el.content;
          });
          this.pages.push(page);

        });
        
        console.log(this.pages);
        observer.next(false);
      });
    });
  }

  isTitleInvalid(item) {
    if (item.META_TITLE=="") return true; else return false;
  }

  isTitleValid(item) {
    if (item.META_TITLE!="") return true; else return false;
  }

  isDescriptionInvalid(item) {
    if (item.META_DESCRIPTION=="") return true; else return false;
  }

  isDescriptionValid(item) {
    if (item.META_DESCRIPTION!="") return true; else return false;
  }

  canSave() {

    let validate: boolean = true;
    this.pages.forEach(element => {
      if (element.META_TITLE=="") validate = false;
      if (element.META_TITLE=="") validate = false;
    });
    return validate;
  }
}
