import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TranslationService} from "../../../services/translation.service";
import {FormControl, FormGroup} from "@angular/forms";
import {ApplicationService} from "../../../services/application.service";

@Component({
  selector: 'app-string-dialog',
  templateUrl: './string-dialog.component.html',
  styleUrls: ['./string-dialog.component.scss']
})
export class StringDialogComponent implements OnInit {

  title: string = "";
  applicationId: any;
  page_loaded: boolean = false;
  appLanguages: any[] = [];
  formGroup: any;
  values: any = {};

  constructor(private applicationService: ApplicationService, private router: Router, private modalService: NgbModal, private translate:TranslationService) { }

  ngOnInit(): void {
    this.applicationId = Number(this.router.url.match(/constructor\/(\d+)/)[1]);
    this.title = this.translate.translatePhrase('CONSTRUCTOR.STRING_DIALOG.TITLE');

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
    for (let i = 0; i < this.appLanguages.length; i++) {
      let val = "";
      if (this.values[this.appLanguages[i]['code']]!== undefined) val = this.values[this.appLanguages[i]['code']];
      fields[this.appLanguages[i]['code']] = new FormControl(val);
    }

    this.formGroup = new FormGroup(fields);
  }

  select() {
    let formValues = this.formGroup.value;
    this.modalService.dismissAll(formValues);
  }

  close () {
    this.modalService.dismissAll({});
  }

}
