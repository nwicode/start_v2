import { Component, OnInit } from '@angular/core';
import {ApplicationService} from "../../../services/application.service";
import {Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TranslationService} from "../../../services/translation.service";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-text-dialog',
  templateUrl: './text-dialog.component.html',
  styleUrls: ['./text-dialog.component.scss']
})
export class TextDialogComponent implements OnInit {

  title: string = "";
  applicationId: any;
  page_loaded: boolean = false;
  appLanguages: any[] = [];
  formGroup: any;
  selectedTab = 0;
  currentLanguage: string;
  values: any = {};

  config: any = {};

  constructor(private applicationService: ApplicationService, private router: Router, private modalService: NgbModal, private translate: TranslationService) { 

    this.config = {
      extraPlugins:
        "easyimage,dialogui,dialog,a11yhelp,about,basicstyles,bidi,blockquote,clipboard," +
        "button,panelbutton,panel,floatpanel,colorbutton,colordialog,menu," +
        "contextmenu,dialogadvtab,div,elementspath,enterkey,entities,popup," +
        "filebrowser,find,fakeobjects,flash,floatingspace,listblock,richcombo," +
        "font,format,forms,horizontalrule,htmlwriter,iframe,image,indent," +
        "indentblock,indentlist,justify,link,list,liststyle,magicline," +
        "maximize,newpage,pagebreak,pastefromword,pastetext,preview,print," +
        "removeformat,resize,save,menubutton,scayt,selectall,showblocks," +
        "showborders,smiley,sourcearea,specialchar,stylescombo,tab,table," +
        "tabletools,templates,toolbar,undo,wsc,wysiwygarea"
    };      

  }

  ngOnInit(): void {
    this.applicationId = Number(this.router.url.match(/constructor\/(\d+)/)[1]);
    this.title = this.translate.translatePhrase('CONSTRUCTOR.TEXT_DIALOG.TITLE');
    this.currentLanguage = this.translate.getSelectedLanguage();
    this.config.language = this.currentLanguage;
    
    this.applicationService.getApplicationLanguages(this.applicationId).then(response => {
      if (!response.is_error) {
        this.appLanguages = response.languages;
        this.page_loaded = true;
        console.log("this.values");
        console.log(this.values);        
        this.loadForm();
      }
    })
  }

  loadForm() {
    let fields = {};
    /*for (let i = 0; i < this.appLanguages.length; i++) {
      fields[this.appLanguages[i]['code']] = new FormControl('');
    }*/

    for (let i = 0; i < this.appLanguages.length; i++) {
      let val = "";
      if (this.values[this.appLanguages[i]['code']]!== undefined) val = this.values[this.appLanguages[i]['code']];
      console.log("val");
      console.log(val);
      fields[this.appLanguages[i]['code']] = new FormControl(val);
    }    

    this.formGroup = new FormGroup(fields);
  }

  save() {
    let formValues = this.formGroup.value;
    this.modalService.dismissAll(formValues);
  }

  close () {
    this.modalService.dismissAll({});
  }

  selectTab(event, index: number) {
    event.preventDefault();
    this.selectedTab = index;
  }
}
