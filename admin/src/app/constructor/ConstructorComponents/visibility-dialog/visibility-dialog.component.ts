import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TranslationService} from "../../../services/translation.service";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-variables-dialog',
  templateUrl: './visibility-dialog.component.html',
  styleUrls: ['./visibility-dialog.component.scss']
})
export class VisibilityDialogComponent implements OnInit {

  @Input() visibility_list: any;
  title: string = '';
  formGroupOR: any;
  formGroupAND: any;
  page_loaded: any = false;
  selectedTab = 0;


  constructor(private modalService: NgbModal, private translate: TranslationService) { }

  ngOnInit(): void {
    this.title = this.translate.translatePhrase('CONSTRUCTOR.VISIBILITY_DIALOG.TITLE');
    this.loadForm();
    this.page_loaded = true;
  }

  loadForm() {
    let fieldsOR = {};
    let fieldsAND = {};
    for (let i = 0; i < this.visibility_list.length; i++) {
      fieldsOR[this.visibility_list[i]['code']] = new FormControl(false);
      fieldsAND[this.visibility_list[i]['code']] = new FormControl(false);
    }

    this.formGroupOR = new FormGroup(fieldsOR);
    this.formGroupAND = new FormGroup(fieldsAND);
  }

  save() {
    let formValuesOR = this.formGroupOR.value;
    let formValuesAND = this.formGroupAND.value;
    let formValues = [];
    formValues['OR'] = formValuesOR;
    formValues['AND'] = formValuesAND;
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
