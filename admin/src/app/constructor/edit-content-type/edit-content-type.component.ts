import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TranslationService} from "../../services/translation.service";
import {SubheaderService} from "../ConstructorComponents/subheader/_services/subheader.service";
import {ToastService} from "../../platform/framework/core/services/toast.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ApplicationService} from "../../services/application.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {environment} from "../../../environments/environment";
import {NumberValidator} from "../../validators/number.validator";
import {GalleryDialog} from "../ConstructorComponents/gallery-dialog/gallery-dialog.objects";
import {GalleryDialogComponent} from "../ConstructorComponents/gallery-dialog/gallery-dialog.component";

interface ContentField {
  name: string,
  order: number,
  list: boolean,
  multilang: boolean,
  default: string,
  db_field: string
}

@Component({
  selector: 'app-edit-content-type',
  templateUrl: './edit-content-type.component.html',
  styleUrls: ['./edit-content-type.component.scss']
})
export class EditContentTypeComponent implements OnInit {

  isLoading$: Observable<boolean>;
  formGroup: FormGroup;

  applicationId: number;
  contentTypeId: number;
  contentType: any;
  resources_dir = '';
  platform_url = '';
  currentLanguage: string;

  fieldTypeCount = {text: 0, image: 0, number: 0, date: 0, logical: 0, string: 0};
  alreadyTakenIndex = {
    text: [false, false, false, false, false],
    image: [false, false, false, false, false],
    number: [false, false, false, false, false],
    date: [false, false, false, false, false],
    logical: [false, false, false, false, false],
    string: [false, false, false, false, false]
  };

  constructor(private translationService: TranslationService, private subheader: SubheaderService, private toastService: ToastService, private formBuilder: FormBuilder, private router: Router, private applicationService: ApplicationService, private modalService: NgbModal, public dialog: MatDialog, private ref: ChangeDetectorRef, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.applicationId = Number(this.router.url.match(/constructor\/(\d+)/)[1]);
    this.contentTypeId = this.activatedRoute.snapshot.params['content_type_id'];
    this.platform_url = environment.apiUrl;
    this.currentLanguage = this.translationService.getSelectedLanguage();

    setTimeout(() => {
      this.subheader.setTitle('CONSTRUCTOR.EDIT_CONTENT_TYPE.TITLE');
      this.subheader.setBreadcrumbs([{
        title: 'CONSTRUCTOR.EDIT_CONTENT_TYPE.TITLE',
        linkText: 'CONSTRUCTOR.EDIT_CONTENT_TYPE.TITLE',
        linkPath: '/constructor/' + this.applicationId + '/edit-content-type/' + this.contentTypeId
      }]);
    }, 1);

    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      Promise.all([this.applicationService.getApplicationById(this.applicationId), this.applicationService.getApplicationContentType(this.applicationId, this.contentTypeId)]).then(response => {
        if (!response[0].is_error) {
          this.resources_dir = 'storage/application/' + response[0].id + "-" + response[0].unique_string_id + '/resources//';
        }

        if (!response[1].is_error) {
          this.contentType = response[1].content_type;
        }

        this.initFormGroup();
        observer.next(false);
      });
    });
  }

  /**
   * Save changes.
   */
  save() {
    this.formGroup.markAllAsTouched();
    if (!this.formGroup.valid) {
      return;
    }

    this.fieldTypeCount = {text: 0, image: 0, number: 0, date: 0, logical: 0, string: 0};
    let fields: ContentField[] = [];
    for (let i = 0; i < this.formGroup.get('fields')['controls'].length; i++) {
      let controls = this.formGroup.get('fields')['controls'][i]['controls'];
      this.fieldTypeCount[controls['field_type'].value]++;

      let db_field;
      if (controls['db_field'] && controls['db_field'].value) {
        db_field = controls['db_field'].value;
      } else {
        for (let j = this.fieldTypeCount[controls['field_type'].value]; j <= 5; j++) {
          if (this.alreadyTakenIndex[controls['field_type'].value][j]) {
            this.fieldTypeCount[controls['field_type'].value]++;
          } else {
            break;
          }

          if (j === this.fieldTypeCount[controls['field_type'].value]) {
            this.toastService.showsToastBar(this.translationService.translatePhrase('CONSTRUCTOR.CREATE_CONTENT_TYPE.NO_MORE_FIVE_FIELD_TYPE'), 'danger');
            return;
          }
        }
        db_field = 'column_' + controls['field_type'].value
            + (controls['field_type'].value !== 'title' ? this.fieldTypeCount[controls['field_type'].value] : '');
      }

      let field: ContentField = {
        db_field: db_field,
        default: controls['default_value'].value,
        list: controls['list'].value,
        multilang: controls['multilang'].value,
        name: controls['field_name'].value,
        order: controls['order'].value
      };
      fields.push(field);
    }

    if (this.fieldTypeCount.text > 5 || this.fieldTypeCount.date > 5 || this.fieldTypeCount.logical > 5 || this.fieldTypeCount.image > 5 || this.fieldTypeCount.number > 5) {
      this.toastService.showsToastBar(this.translationService.translatePhrase('CONSTRUCTOR.CREATE_CONTENT_TYPE.NO_MORE_FIVE_FIELD_TYPE'), 'danger');
      return;
    }

    let structure = JSON.stringify({fields: fields});

    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);

      this.applicationService.editApplicationContentType(this.applicationId, this.contentTypeId, this.formGroup.get('content_name').value, structure).then(response => {
        if (response.is_error) {
          this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_NOT_SAVED'), 'danger');
        } else {
          this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_SAVED'), 'success');

          this.router.navigate(['/constructor/' + this.applicationId + '/content/content-list/' + response.contentType.id]);
          observer.next(false);
        }
      })
    });
  }

  /**
   * Remove changes.
   */
  cancel() {
    this.initFormGroup();
  }

  /**
   * Init form group.
   */
  initFormGroup() {
    this.fieldTypeCount = {text: 0, image: 0, number: 0, date: 0, logical: 0, string: 0};
    this.alreadyTakenIndex = {
      text: [false, false, false, false, false],
      image: [false, false, false, false, false],
      number: [false, false, false, false, false],
      date: [false, false, false, false, false],
      logical: [false, false, false, false, false],
      string: [false, false, false, false, false]
    };

    this.transformContentTypeStructureToFormControls();
  }

  transformContentTypeStructureToFormControls() {
    let fields = JSON.parse(this.contentType.structure).fields;
    let fieldsArray = new FormArray([]);

    for (let i = 0; i < fields.length; i++) {
      if (fields[i].db_field !== 'column_title') {
        let fieldOption = fields[i].db_field.match(/^column_([A-z]+)(\d*)$/);
        this.alreadyTakenIndex[fieldOption[1]][fieldOption[2]] = true;
      }

      let fieldGroup = this.formBuilder.group({
        field_name: [fields[i].name, Validators.required],
        order: [{value: fields[i].order, disabled: true}, Validators.compose([Validators.required, NumberValidator.checkIntegerGreater0])],
        list: [fields[i].list],
        multilang: [fields[i].multilang],
        default_value: [fields[i].default],
        field_type: [fields[i].db_field.match(/^column_([A-z]+)\d*$/)[1], Validators.required],
        db_field: [fields[i].db_field]
      });

      fieldsArray.push(fieldGroup);
    }

    this.formGroup = this.formBuilder.group({
      content_name: [this.contentType.name, Validators.required],
      fields: fieldsArray
    });
  }

  /**
   * Add form for new field.
   */
  addNewField() {
    let fieldGroup = this.formBuilder.group({
      field_name: ['', Validators.required],
      order: [{value: this.formGroup.get('fields')['controls'].length + 1, disabled: true}, Validators.compose([Validators.required, NumberValidator.checkIntegerGreater0])],
      list: [false],
      multilang: [false],
      default_value: [''],
      field_type: ['', Validators.required]
    });

    (this.formGroup.get('fields') as FormArray).push(fieldGroup);
  }

  openGalleryDialog(i: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '1000px';
    dialogConfig.data = new GalleryDialog(this.resources_dir, false, '.jpg,.png,.jpeg,.ico,.svg', this.resources_dir);
    const dialogRef = this.dialog.open(GalleryDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.formGroup.get('fields')['controls'][i]['controls']['default_value'].value = result.fileName;
        this.ref.detectChanges();
      }
    });
  }

  /**
   * Switch place with field with index i - 1.
   *
   * @param i index
   */
  orderUp(i: number) {
    if (i !== 0) {
      let tmp = this.formGroup.get('fields')['controls'][i];
      this.formGroup.get('fields')['controls'][i] = this.formGroup.get('fields')['controls'][i - 1];
      this.formGroup.get('fields')['controls'][i]['controls']['order'].setValue(this.formGroup.get('fields')['controls'][i]['controls']['order'].value + 1);
      this.formGroup.get('fields')['controls'][i - 1] = tmp;
      this.formGroup.get('fields')['controls'][i - 1]['controls']['order'].setValue(this.formGroup.get('fields')['controls'][i - 1]['controls']['order'].value - 1);
      this.ref.detectChanges();
    }
  }

  /**
   * Switch place with field with index i + 1.
   *
   * @param i index
   */
  orderDown(i: number) {
    if (i !== this.formGroup.get('fields')['controls'].length - 1) {
      let tmp = this.formGroup.get('fields')['controls'][i];
      this.formGroup.get('fields')['controls'][i] = this.formGroup.get('fields')['controls'][i + 1];
      this.formGroup.get('fields')['controls'][i]['controls']['order'].setValue(this.formGroup.get('fields')['controls'][i]['controls']['order'].value - 1);
      this.formGroup.get('fields')['controls'][i + 1] = tmp;
      this.formGroup.get('fields')['controls'][i + 1]['controls']['order'].setValue(this.formGroup.get('fields')['controls'][i + 1]['controls']['order'].value + 1);
      this.ref.detectChanges();
    }
  }

  /**
   * Delete field at index i
   * @param i index
   * @param field_type field type
   */
  deleteField(i: number, field_type: string) {
    if (field_type === 'title') {
      return;
    }

    for (let j = i + 1; j < this.formGroup.get('fields')['controls'].length; j++) {
      this.formGroup.get('fields')['controls'][j]['controls']['order'].setValue(this.formGroup.get('fields')['controls'][j]['controls']['order'].value - 1);
    }
    this.formGroup.get('fields')['controls'].splice(i, 1);

    this.formGroup.get('fields').updateValueAndValidity();
  }

}
