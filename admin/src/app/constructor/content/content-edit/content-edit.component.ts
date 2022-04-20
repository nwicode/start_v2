import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TranslationService} from "../../../services/translation.service";
import {SubheaderService} from "../../ConstructorComponents/subheader/_services/subheader.service";
import {ToastService} from "../../../platform/framework/core/services/toast.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ApplicationService} from "../../../services/application.service";
import {environment} from "../../../../environments/environment";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {GalleryDialog} from "../../ConstructorComponents/gallery-dialog/gallery-dialog.objects";
import {GalleryDialogComponent} from "../../ConstructorComponents/gallery-dialog/gallery-dialog.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-content-edit',
  templateUrl: './content-edit.component.html',
  styleUrls: ['./content-edit.component.scss']
})
export class ContentEditComponent implements OnInit {

  title:string = "";
  title_text:string = "";

  subscriptions: Subscription[] = [];
  isLoading$: Observable<boolean>;
  formGroup: FormGroup;

  applicationId: number;
  contentTypeId: number;
  contentId: number;

  resources_dir = '';
  platform_url = '';
  languages: any = [];
  defaultLanguage = '';
  currentLanguage: string;

  fields: any[] = [];
  fieldsValues: any[] = [];

  constructor(private translationService: TranslationService, private subheader: SubheaderService, private toastService: ToastService, private formBuilder: FormBuilder, private router: Router, private applicationService: ApplicationService, private route: ActivatedRoute, private modalService: NgbModal, public dialog: MatDialog, private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.applicationId = Number(this.router.url.match(/constructor\/(\d+)/)[1]);
    this.contentTypeId = Number(this.route.snapshot.paramMap.get('content_type'));
    this.contentId = Number(this.route.snapshot.paramMap.get('content_id'));
    this.platform_url = environment.apiUrl;
    this.currentLanguage = this.translationService.getSelectedLanguage();

    if (this.contentId === 0) {
      this.title = "ADD_TITLE";
      this.title_text = "ADD_TITLE_TEXT";
      setTimeout(() => {
        this.subheader.setTitle('CONSTRUCTOR.CONTENT_EDIT.ADD_TITLE');
        this.subheader.setBreadcrumbs([{
          title: 'CONSTRUCTOR.CONTENT_EDIT.ADD_TITLE',
          linkText: 'CONSTRUCTOR.CONTENT_EDIT.ADD_TITLE',
          linkPath: '/constructor/' + this.applicationId + '/content/content-edit/' + this.contentTypeId + '/' + this.contentId
        }]);
      }, 1);
    } else {
      this.title = "EDIT_TITLE";
      this.title_text = "EDIT_TITLE_TEXT";
      setTimeout(() => {
        this.subheader.setTitle('CONSTRUCTOR.CONTENT_EDIT.EDIT_TITLE');
        this.subheader.setBreadcrumbs([{
          title: 'CONSTRUCTOR.CONTENT_EDIT.EDIT_TITLE',
          linkText: 'CONSTRUCTOR.CONTENT_EDIT.EDIT_TITLE',
          linkPath: '/constructor/' + this.applicationId + '/content/content-edit/' + this.contentTypeId + '/' + this.contentId
        }]);
      }, 1);
    }

    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      Promise.all([this.applicationService.getApplicationContent(this.applicationId, this.contentTypeId, this.contentId), this.applicationService.getApplicationById(this.applicationId)]).then(response => {
        this.fields = response[0].fields;
        this.fieldsValues = response[0].fields_value;
        this.languages = response[0].languages;
        this.defaultLanguage = response[0].default_language;


        Object.entries(response[0].fields_value).forEach(([key, value]) => {
          if (key.startsWith('column_text') || key.startsWith('column_title') || key.startsWith('column_string')) {
            this.fieldsValues[key] = JSON.parse(<string>value);
          }
        });

        this.resources_dir = 'storage/application/' + response[1].id + "-" + response[1].unique_string_id + '/resources//';

        this.initFormGroup();
        observer.next(false);
      });
    });
  }

  /**
   * Init form group.
   */
  initFormGroup() {
    let controls = {};
    for (let i = 0; i < this.fields.length; i++) {
      if (this.fields[i].db_field.startsWith('column_text') || this.fields[i].db_field.startsWith('column_title') || this.fields[i].db_field.startsWith('column_string')) {
        if (this.fields[i].multilang) {
          for (let j = 0; j < this.languages.length; j++) {
            if (this.fieldsValues[this.fields[i].db_field]) {
              controls[this.fields[i].db_field + '_' + this.languages[j].code] = [this.fieldsValues[this.fields[i].db_field][this.languages[j].code] ? this.fieldsValues[this.fields[i].db_field][this.languages[j].code] : this.fields[i].default, Validators.required];
            } else {
              controls[this.fields[i].db_field + '_' + this.languages[j].code] = [this.fields[i].default, Validators.required];
            }
          }
        } else {
          if (this.fieldsValues[this.fields[i].db_field]) {
            controls[this.fields[i].db_field + '_' + this.defaultLanguage] = [this.fieldsValues[this.fields[i].db_field][this.defaultLanguage] ? this.fieldsValues[this.fields[i].db_field][this.defaultLanguage] : this.fields[i].default, Validators.required];
          } else {
            controls[this.fields[i].db_field + '_' + this.defaultLanguage] = [this.fields[i].default, Validators.required];
          }
        }
      } else if (this.fields[i].db_field.startsWith('column_logical')) {
        controls[this.fields[i].db_field] = [(this.fieldsValues[this.fields[i].db_field] !== null && this.fieldsValues[this.fields[i].db_field] !== undefined) ? !!this.fieldsValues[this.fields[i].db_field] : !!this.fields[i].default, Validators.required]
      } else {
        controls[this.fields[i].db_field] = [this.fieldsValues[this.fields[i].db_field] ? this.fieldsValues[this.fields[i].db_field] : this.fields[i].default, Validators.required]
      }
    }

    this.formGroup = this.formBuilder.group(controls);
  }

  /**
   * Save changes.
   */
  save() {
    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      let values = this.formGroup.value;

      let sendValue = {};

      Object.entries(values).forEach(([key, value]) => {
        if (key.startsWith('column_text') || key.startsWith('column_title') || key.startsWith('column_string')) {
          let code = key.match('^column_.*_(..)$')[1];
          console.log('code', code);
          let column = key.match('^(column_.*)_..$')[1];
          if (sendValue[column]) {
            sendValue[column][code] = value;
          } else {
            sendValue[column] = {};
            sendValue[column][code] = value;
          }
        } else {
          sendValue[key] = value;
        }
      });

      this.applicationService.setApplicationContent(this.applicationId, this.contentTypeId, this.contentId, sendValue).then(response => {
        if (response.is_error) {
          this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_NOT_SAVED'), 'danger');
        } else {
          this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_SAVED'), 'success');

        }
        observer.next(false);
      });
    });
  }

  /**
   * Remove changes.
   */
  cancel() {

    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      this.applicationService.getApplicationContent(this.applicationId, this.contentTypeId, this.contentId).then(response => {
        this.fields = response.fields;
        this.fieldsValues = response.fields_value;
        this.languages = response.languages;
        this.defaultLanguage = response.default_language;

        this.initFormGroup();
        observer.next(false);
      });
    });

    this.initFormGroup();
  }

  openGalleryDialog(db_field: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '1000px';
    dialogConfig.data = new GalleryDialog(this.resources_dir, false, '.jpg,.png,.jpeg,.ico,.svg', this.resources_dir);
    const dialogRef = this.dialog.open(GalleryDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.formGroup['controls'][db_field].setValue(result.fileName);
        this.ref.detectChanges();
      }
    });
  }

  // helpers for View
  isControlValid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }
}
