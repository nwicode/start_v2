import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {CollectionService} from "../../../services/collection.service";
import {TranslationService} from "../../../services/translation.service";
import {SubheaderService} from "../../ConstructorComponents/subheader/_services/subheader.service";
import {ToastService} from "../../../platform/framework/core/services/toast.service";
import {ApplicationService} from "../../../services/application.service";
import {NumberValidator} from "../../../validators/number.validator";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {GalleryDialog} from "../../ConstructorComponents/gallery-dialog/gallery-dialog.objects";
import {GalleryDialogComponent} from "../../ConstructorComponents/gallery-dialog/gallery-dialog.component";
import {environment} from "../../../../environments/environment";


@Component({
  selector: 'app-edit-record',
  templateUrl: './edit-record.component.html',
  styleUrls: ['./edit-record.component.scss']
})
export class EditRecordComponent implements OnInit {
  isLoading$: Observable<boolean>;
  applicationId: number;
  record_id: string = "";
  collectionId;
  app;
  resources_dir = '';
  platform_url = '';
  formGroup: FormGroup;

  collection;

  collectionFields;


  constructor(private route: ActivatedRoute, private router: Router, private collectionService: CollectionService, private translationService: TranslationService, private subheader: SubheaderService,private toastService: ToastService, private formBuilder: FormBuilder, private ref: ChangeDetectorRef, private applicationService: ApplicationService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.applicationId = Number(this.router.url.match(/constructor\/(\d+)/)[1]);
    this.collectionId = this.route.snapshot.paramMap.get('collection_id');
    this.record_id = this.route.snapshot.paramMap.get('record_id');
    this.platform_url = environment.apiUrl;

    setTimeout(() => {
      this.subheader.setTitle('CONSTRUCTOR.RECORD_EDIT.TITLE');
      this.subheader.setBreadcrumbs([{
        title: 'CONSTRUCTOR.RECORD_EDIT.TITLE',
        linkText: 'CONSTRUCTOR.RECORD_EDIT.TITLE',
        linkPath: '/constructor/' + this.applicationId + '/collections/record-edit/' + this.collectionId + '/' + this.record_id
      }]);
    }, 1);

    this.initFormGroup();
  }

  /**
   * Init form group.
   */
  initFormGroup() {
    if (this.record_id === '0') {
      this.isLoading$ = new Observable<boolean>( observer => {
        observer.next(true);

        Promise.all([this.collectionService.getCollection(this.applicationId, this.collectionId), this.applicationService.getApplicationById(this.applicationId)]).then(response => {
          this.collection = response[0].collection;

          this.collectionFields = JSON.parse(this.collection.fields);
          this.collectionFields = this.collectionFields.fields;

          this.app = response[1];
          this.resources_dir = 'storage/application/' + response[1].id + "-" + response[1].unique_string_id + '/resources//';

          this.initFormGroupForNewRecord();
          observer.next(false);
        });
      });
    } else {
      this.isLoading$ = new Observable<boolean>( observer => {
        observer.next(true);

        Promise.all([this.collectionService.getCollection(this.applicationId, this.collectionId), this.applicationService.getApplicationById(this.applicationId), this.collectionService.getCollectionRecord(this.applicationId, this.record_id)]).then(response => {
          this.collection = response[0].collection;

          this.collectionFields = JSON.parse(this.collection.fields);
          this.collectionFields = this.collectionFields.fields;

          this.app = response[1];
          this.resources_dir = 'storage/application/' + response[1].id + "-" + response[1].unique_string_id + '/resources//';

          console.log(response[2]);
          this.initFormGroupForEditRecord(response[2].record.values);
          observer.next(false);
        });
      });
    }
  }

  /**
   * Init form group.
   */
  initFormGroupForNewRecord() {
    let fieldsConfig = {};

    for (let i = 0; i < this.collectionFields.length; i++) {
      if (this.collectionFields[i].required) {
        fieldsConfig[this.collectionFields[i].fieldId] = ['', Validators.required]
      } else {
        fieldsConfig[this.collectionFields[i].fieldId] = ['']
      }
    }

    this.formGroup = this.formBuilder.group(fieldsConfig);
  }

  /**
   * Init form group.
   */
  initFormGroupForEditRecord(values) {
    let fields = JSON.parse(values);
    let fieldsConfig = {};
    for (let i = 0; i < this.collectionFields.length; i++) {
      if (fields.hasOwnProperty(this.collectionFields[i].fieldId)) {
        if (this.collectionFields[i].required) {
          fieldsConfig[this.collectionFields[i].fieldId] = [fields[this.collectionFields[i].fieldId], Validators.required];
        } else {
          fieldsConfig[this.collectionFields[i].fieldId] = [fields[this.collectionFields[i].fieldId]];
        }
      } else {
        if (this.collectionFields[i].required) {
          fieldsConfig[this.collectionFields[i].fieldId] = ['', Validators.required];
        } else {
          fieldsConfig[this.collectionFields[i].fieldId] = [''];
        }
      }
    }
    this.formGroup = this.formBuilder.group(fieldsConfig);
  }


  cancel() {
    this.initFormGroup();
  }

  save() {
    this.formGroup.markAllAsTouched();
    if (!this.formGroup.valid) {
      return;
    }

    console.log(this.formGroup.value)

    this.isLoading$ = new Observable<boolean>( observer => {
      observer.next(true);
      if (this.record_id === '0') {
        this.collectionService.createCollectionRecord(this.applicationId, this.collectionId, JSON.stringify(this.formGroup.value)).then(response => {
          if (response.is_error) {
            this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_NOT_SAVED'), 'danger');
          } else {
            this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_SAVED'), 'success');
          }
          observer.next(false);
        });
      } else {
        this.collectionService.editCollectionRecord(this.applicationId, this.record_id, JSON.stringify(this.formGroup.value)).then(response => {
          if (response.is_error) {
            this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_NOT_SAVED'), 'danger');
          } else {
            this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_SAVED'), 'success');
          }
          observer.next(false);
        });
      }
    });
  }

  openGalleryDialog(field: string, fileTypes: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '1000px';
    dialogConfig.data = new GalleryDialog(this.resources_dir, false, fileTypes, this.resources_dir);
    const dialogRef = this.dialog.open(GalleryDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.formGroup['controls'][field].setValue(result.fileName);
        this.ref.detectChanges();
      }
    });
  }
}
