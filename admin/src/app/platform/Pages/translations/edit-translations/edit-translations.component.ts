import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import {UserService} from '../../../../services/user.service';
import {TranslationService} from '../../../../services/translation.service';
import {ToastService} from '../../../framework/core/services/toast.service';
import { SubheaderService } from '../../../LayoutsComponents/subheader/_services/subheader.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';



@Component({
  selector: 'app-edit-translations',
  templateUrl: './edit-translations.component.html',
  styleUrls: ['./edit-translations.component.scss']
})
export class EditTranslationsComponent implements OnInit {

  private lang_id:string = "";
  pagination_string:string = "";
  page_current = 1;
  items_per_page = 10;
  pages_count = 0;
  collection_size = 0;
  subscriptions: Subscription[] = [];
  isLoading$: Observable<boolean>;
  languages: any[];
  formGroup: FormGroup;

  translation_filtered:any[];
  translation_full:any[];
  translation_bakup:any[];

  was_changes: boolean = false;
  filter: string = "";
  section_filter: string = "";
  section_array: string[] = [];


  constructor(private route: ActivatedRoute,private subheader: SubheaderService,private toastService: ToastService, private userService: UserService, private fb: FormBuilder, private translationService: TranslationService) {
    
    this.route.params.subscribe(val => {
      console.log("get lang_id:");
      console.log(this.route.snapshot.paramMap.get('lang_id'));
      this.lang_id = this.route.snapshot.paramMap.get('lang_id');
      this.loadLanguageData();
    });    
  }


  /**
   * Show pagination string
   */
  paginationString() {
    this.pagination_string = this.translationService.translatePhrase("GENERAL.LANGUAGES.PAGINATION");
    this.pagination_string = this.pagination_string.replace("%total",this.pages_count.toString());
    this.pagination_string = this.pagination_string.replace("%page",this.page_current.toString());
    return this.pagination_string;
  }

  
  async ngOnInit() {
    await this.translationService.readLanguages();
  }

  /**
   * Load translation for lang_id from server
   */
  private loadLanguageData() {
    console.log("lang_id");
    console.log(this.lang_id);
    this.was_changes = false;
    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      this.translationService.loadtranslations(this.lang_id).then( result =>{
        //console.log("loadtranslations result:");
        //console.log(result);
        this.translation_full = result.translations;
        this.translation_bakup = result.translations;
        this.collection_size = result.translations.length;
        this.page_current = 1;
        this.section_array = [];
        this.section_filter = "-";

        //build section filter
        this.translation_full.forEach(el => {
          if (!this.section_array.includes(el.section+'.SECTION_HEADER')) this.section_array.push(el.section+'.SECTION_HEADER');
        });


        this.prepareTranslationFiltered();
      }).catch(err=> {
        console.log("loadtranslations error:")
        console.log(err);
        this.toastService.showsToastBar(this.translationService.translatePhrase('ERROR.MESSAGES.REQUEST_ERROR'), 'danger');
      }).finally(()=>{
        observer.next(false);
      }).then(() => {
        this.subheader.setTitle('PAGE.TRANSLATIONS.EDIT_LANGUAGE');
        this.subheader.setBreadcrumbs([{
          title: 'PAGE.TRANSLATIONS.TITLE',
          linkText: 'PAGE.TRANSLATIONS.TITLE',
          linkPath: '/translations'
        }]);
      });
      
    });

  }

  /**
   * Create temp array for tables
   */
  prepareTranslationFiltered() {


    let chunks:any = [];
    this.translation_filtered = [];

    
    var i,j;
    for (i = 0,j = this.translation_full.length; i < j; i += this.items_per_page) {
      chunks.push(this.translation_full.slice(i, i + this.items_per_page-1));
    }
    this.translation_filtered = chunks[this.page_current-1];
    this.pages_count = chunks.length;
    //console.log(this.translation_filtered);
  }


  /**
   *  set waschnged flag on item 
   * @param item update translation in full_array
   */
  updateTranslation(item) {
    item.was_changed = true;
    //send this flag in base array too

    this.translation_full.forEach(element => {
      if (element.id==item.id) element.was_changed = true;
      this.was_changes = true;
    });
  }


  /**
   * Change page event
   * @param event page change event
   */
  pageChange(event:string) {
    //console.log(event);
    this.page_current = parseInt(event);
    this.prepareTranslationFiltered();
  }

  /**
   * reset base array and retrive it from server
   */
  cancel() {
    this.was_changes = false;
    this.loadLanguageData();
  }

  /**
   * Send changed translations to core
   */
  save() {
    this.isLoading$ = new Observable<boolean>(observer => {

      let changed_translations: any = [];
      this.translation_full.forEach(element => {
        if (element.was_changed) changed_translations.push({id:element.id, translation:element.translation});

      });
      
      observer.next(true);
      this.translationService.updateTranslations(changed_translations).then ( result=>{
        console.log("updateTranslations result:");
        if (result.is_error) {
          this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_NOT_SAVED'), 'danger');
        } else {
          this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_SAVED'), 'success');
          this.was_changes = false;
          this.filter = "";
          this.loadLanguageData();          
        }
        console.log(result);
        observer.next(false);
      });
      
    });    
  }


  setSectionFilter(section) {
    this.section_filter = section;
    console.log("setSectionFilter");
    console.log(this.section_filter);
    this.applyFilter({});
  }


  /**
   * Apply filter
   */
  applyFilter(event) {
    
    //add section filter
    let section_filter = "";

    if (this.section_filter!='' && this.section_filter!='-') {
      section_filter = this.section_filter.replace(".SECTION_HEADER","");
    }

    if (this.filter=="" && section_filter=="") {
      this.translation_full = this.translation_bakup;
      this.page_current = 1;
      this.collection_size =this.translation_full.length;
      this.prepareTranslationFiltered();
    } else {

      this.translation_full = this.translation_bakup;
      
      if (this.filter!="") this.translation_full = this.translation_bakup.filter( t => t.section.toLowerCase().includes(this.filter.toLowerCase()) || t.default.toLowerCase().includes(this.filter.toLowerCase()) || t.phrase.toLowerCase().includes(this.filter.toLowerCase()));
      
      if (section_filter!="") {
        let translations_copy = this.translation_full;
        this.translation_full = [];
        translations_copy.forEach(element => {
          if (element.section==section_filter) {
            this.translation_full.push(element);
          }

        });
      }

      this.page_current = 1;
      this.collection_size =this.translation_full.length;
      this.prepareTranslationFiltered();      
    }
  }



}
