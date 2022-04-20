import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {CollectionService} from "../../../services/collection.service";
import {TranslationService} from "../../../services/translation.service";
import {SubheaderService} from "../../ConstructorComponents/subheader/_services/subheader.service";
import {ToastService} from "../../../platform/framework/core/services/toast.service";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {environment} from "../../../../environments/environment";
import {NumberValidator} from "../../../validators/number.validator";
import {ApplicationService} from "../../../services/application.service";

interface CollectionField {
  field_name: string,
  order: number,
  required: boolean,
  field_type: string
}

@Component({
  selector: 'app-edit-collection',
  templateUrl: './edit-collection.component.html',
  styleUrls: ['./edit-collection.component.scss']
})
export class EditCollectionComponent implements OnInit {

  isLoading$: Observable<boolean>;
  applicationId: number;
  collection_id: string = "";
  formGroup: FormGroup;

  appLanguages = [];

  fields = [];
  next_field_id = 1;

  constructor(private route: ActivatedRoute, private router: Router, private collectionService: CollectionService, private translationService: TranslationService, private subheader: SubheaderService,private toastService: ToastService, private formBuilder: FormBuilder, private ref: ChangeDetectorRef, private applicationService: ApplicationService) { }

  ngOnInit(): void {
    this.applicationId = Number(this.router.url.match(/constructor\/(\d+)/)[1]);
    this.collection_id = this.route.snapshot.paramMap.get('collection_id');

    setTimeout(() => {
      this.subheader.setTitle('CONSTRUCTOR.COLLECTION_EDIT.TITLE');
      this.subheader.setBreadcrumbs([{
        title: 'CONSTRUCTOR.COLLECTION_EDIT.TITLE',
        linkText: 'CONSTRUCTOR.COLLECTION_EDIT.TITLE',
        linkPath: '/constructor/' + this.applicationId + '/collections/collection-edit/' + this.collection_id
      }]);
    }, 1);

    this.initFormGroup();
  }

  initFormGroup() {
    if (this.collection_id === '0') {
      this.isLoading$ = new Observable<boolean>(observer => {
        observer.next(true);
        this.applicationService.getApplicationLanguages(this.applicationId).then(response => {
          this.appLanguages = response.languages;
          this.initFormGroupForNewCollection();
          observer.next(false);
        });
      });
    } else {
      this.isLoading$ = new Observable<boolean>(observer => {
        observer.next(true);
        Promise.all([this.applicationService.getApplicationLanguages(this.applicationId), this.collectionService.getCollection(this.applicationId, this.collection_id)]).then(response => {
          this.appLanguages = response[0].languages;

          this.next_field_id = response[1].collection.next_field_id;
          this.initFormGroupForEditCollection(response[1].collection.name, response[1].collection.emails, response[1].collection.fields);
          observer.next(false);
        });
      });
    }
  }

  /**
   * Init form group.
   */
  initFormGroupForNewCollection() {
    let fieldsConfig = {
      fieldId: [this.next_field_id],
      order: [{value: 1, disabled: true}, Validators.compose([Validators.required, NumberValidator.checkIntegerGreater0])],
      required: [false],
      field_type: ['', Validators.required]
    };
    this.next_field_id++;

    for (let i = 0; i < this.appLanguages.length; i++) {
      fieldsConfig['field_name_' + this.appLanguages[i].code] = ['', Validators.required];
    }

    let fieldGroup = this.formBuilder.group(fieldsConfig);

    let controlsConfig = {
      emails: [''],
      fields: new FormArray([fieldGroup]),
      collection_name: ['', Validators.required]
    }

    this.formGroup = this.formBuilder.group(controlsConfig);
  }

  /**
   * Init form group.
   */
  initFormGroupForEditCollection(name, emails, fields) {
    let fieldsArray = JSON.parse(fields).fields;
    let formArray = new FormArray([]);

    for (let i = 0; i < fieldsArray.length; i++) {
      let fieldsConfig = {
        fieldId: [fieldsArray[i].fieldId],
        order: [{value: fieldsArray[i].order, disabled: true}, Validators.compose([Validators.required, NumberValidator.checkIntegerGreater0])],
        required: [fieldsArray[i].required],
        field_type: [{value:fieldsArray[i].field_type, disabled: true}, Validators.required]
      };


      for (let j = 0; j < this.appLanguages.length; j++) {
        if (fieldsArray[i].hasOwnProperty('field_name_' + this.appLanguages[j].code)) {
          fieldsConfig['field_name_' + this.appLanguages[j].code] = [fieldsArray[i]['field_name_' + this.appLanguages[j].code], Validators.required];
        } else {
          fieldsConfig['field_name_' + this.appLanguages[j].code] = ['', Validators.required];
        }
      }

      let fieldGroup = this.formBuilder.group(fieldsConfig);

      formArray.push(fieldGroup);
    }

    let controlsConfig = {
      emails: [emails ? emails : ''],
      fields: formArray
    }


    if (name) {
      controlsConfig['collection_name'] = [name, Validators.required];
    } else {
      controlsConfig['collection_name'] = ['', Validators.required];
    }

    this.formGroup = this.formBuilder.group(controlsConfig);
  }

  cancel() {
    this.initFormGroup();
  }

  save() {
    this.formGroup.markAllAsTouched();
    if (!this.formGroup.valid) {
      return;
    }

    let fields = [];
    for (let i = 0; i < this.formGroup.get('fields')['controls'].length; i++) {
      let controls = this.formGroup.get('fields')['controls'][i]['controls'];

      let field = {
        required: controls['required'].value,
        order: controls['order'].value,
        field_type: controls['field_type'].value,
        fieldId: controls['fieldId'].value
      };

      for (let i = 0; i < this.appLanguages.length; i++) {
        field['field_name_' + this.appLanguages[i].code] = controls['field_name_' + this.appLanguages[i].code].value;
      }

      fields.push(field);
    }

    let structure = JSON.stringify({fields: fields});


    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);

      let func;
      if (this.collection_id === '0') {
        func = this.collectionService.createCollection(this.applicationId, this.formGroup.get('collection_name').value, structure, this.formGroup.get('emails').value, this.next_field_id);
      } else {
        func = this.collectionService.editCollection(this.applicationId, this.collection_id, this.formGroup.get('collection_name').value, structure, this.formGroup.get('emails').value, this.next_field_id);
      }

      func.then(response => {
        console.log(response);
        if (response.is_error) {
          this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_NOT_SAVED'), 'danger');
        } else {
          this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_SAVED'), 'success');
          this.router.navigate(['/constructor/' + this.applicationId + '/collections/collection-list/']);
        }
        observer.next(false);
      })
    });
  }

  /**
   * Add form for new field.
   */
  addNewField() {

    let fieldsConfig = {
      order: [{value: this.formGroup.get('fields')['controls'].length + 1, disabled: true}, Validators.compose([Validators.required, NumberValidator.checkIntegerGreater0])],
      required: [false],
      field_type: ['', Validators.required],
      fieldId: [this.next_field_id]
    };
    this.next_field_id++;

    for (let i = 0; i < this.appLanguages.length; i++) {
      fieldsConfig['field_name_' + this.appLanguages[i].code] = ['', Validators.required];
    }

    let fieldGroup = this.formBuilder.group(fieldsConfig);

    (this.formGroup.get('fields') as FormArray).push(fieldGroup);
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
    for (let j = i + 1; j < this.formGroup.get('fields')['controls'].length; j++) {
      this.formGroup.get('fields')['controls'][j]['controls']['order'].setValue(this.formGroup.get('fields')['controls'][j]['controls']['order'].value - 1);
    }
    this.formGroup.get('fields')['controls'].splice(i, 1);

    this.formGroup.get('fields').updateValueAndValidity();
  }
}
