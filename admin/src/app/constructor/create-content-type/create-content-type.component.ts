import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {TranslationService} from "../../services/translation.service";
import {SubheaderService} from "../ConstructorComponents/subheader/_services/subheader.service";
import {ToastService} from "../../platform/framework/core/services/toast.service";
import {Router} from "@angular/router";
import {NumberValidator} from "../../validators/number.validator";
import {ApplicationService} from "../../services/application.service";
import {ConstructorDynamicAsideMenuService} from "../ConstructorComponents/aside-menu/services/constructor-dynamic-aside-menu.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {GalleryDialog} from "../ConstructorComponents/gallery-dialog/gallery-dialog.objects";
import {GalleryDialogComponent} from "../ConstructorComponents/gallery-dialog/gallery-dialog.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {GalleryImagesService} from "../ConstructorComponents/gallery-dialog/services/gallery-images.service";
import {environment} from "../../../environments/environment";

interface ContentField {
    name: string,
    order: number,
    list: boolean,
    multilang: boolean,
    default: string,
    db_field: string
}

@Component({
    selector: 'app-create-content-type',
    templateUrl: './create-content-type.component.html',
    styleUrls: ['./create-content-type.component.scss']
})
export class CreateContentTypeComponent implements OnInit {

    isLoading$: Observable<boolean>;
    formGroup: FormGroup;

    applicationId: number;
    resources_dir = '';
    platform_url = '';
    currentLanguage: string;

    fieldTypeCount = {text: 0, image: 0, number: 0, date: 0, logical: 0, string: 0};

    constructor(private translationService: TranslationService, private subheader: SubheaderService, private toastService: ToastService, private formBuilder: FormBuilder, private router: Router, private applicationService: ApplicationService, private constructorDynamicAsideMenuService: ConstructorDynamicAsideMenuService, private modalService: NgbModal, public dialog: MatDialog, private ref: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this.applicationId = Number(this.router.url.match(/constructor\/(\d+)/)[1]);
        this.platform_url = environment.apiUrl;
        this.currentLanguage = this.translationService.getSelectedLanguage();

        setTimeout(() => {
            this.subheader.setTitle('CONSTRUCTOR.CREATE_CONTENT_TYPE.TITLE');
            this.subheader.setBreadcrumbs([{
                title: 'CONSTRUCTOR.CREATE_CONTENT_TYPE.TITLE',
                linkText: 'CONSTRUCTOR.CREATE_CONTENT_TYPE.TITLE',
                linkPath: '/constructor/' + this.applicationId + '/create-content-type'
            }]);
        }, 1);

        this.isLoading$ = new Observable<boolean>(observer => {
            observer.next(true);
            this.applicationService.getApplicationById(this.applicationId).then(response => {
               if (!response.is_error) {
                   this.resources_dir = 'storage/application/' + response.id + "-" + response.unique_string_id + '/resources//';
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

            let db_field;
            if (controls['field_type'].value === 'title') {
                db_field = 'column_title';
            } else {
                this.fieldTypeCount[controls['field_type'].value]++;
                db_field = 'column_' + controls['field_type'].value + this.fieldTypeCount[controls['field_type'].value];
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

        if (this.fieldTypeCount.text > 5 || this.fieldTypeCount.date > 5 || this.fieldTypeCount.logical > 5 || this.fieldTypeCount.image > 5 || this.fieldTypeCount.number > 5 || this.fieldTypeCount.string > 5) {
            this.toastService.showsToastBar(this.translationService.translatePhrase('CONSTRUCTOR.CREATE_CONTENT_TYPE.NO_MORE_FIVE_FIELD_TYPE'), 'danger');
            return;
        }

        let structure = JSON.stringify({fields: fields});

        this.isLoading$ = new Observable<boolean>(observer => {
            observer.next(true);

            this.applicationService.createApplicationContentType(this.applicationId, this.formGroup.get('content_name').value, structure).then(response => {
                if (response.is_error) {
                    this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_NOT_SAVED'), 'danger');
                } else {
                    this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_SAVED'), 'success');

                    this.constructorDynamicAsideMenuService.getSideMenu().then(() => {
                        this.router.navigate(['/constructor/' + this.applicationId + '/content/content-list/' + response.contentType.id]);
                        observer.next(false);
                    });
                }
            })
        });
    }

    /**
     * Remove changes.
     */
    cancel() {
        this.fieldTypeCount = {text: 0, image: 0, number: 0, date: 0, logical: 0, string: 0};
        this.initFormGroup();
    }

    /**
     * Init form group.
     */
    initFormGroup() {
        let fieldGroup = this.formBuilder.group({
            field_name: [this.translationService.translatePhrase('CONSTRUCTOR.CREATE_CONTENT_TYPE.CONTENT_TITLE'), Validators.required],
            order: [{value: 1, disabled: true}, Validators.compose([Validators.required, NumberValidator.checkIntegerGreater0])],
            list: [false],
            multilang: [false],
            default_value: [''],
            field_type: ['title', Validators.required]
        });

        this.formGroup = this.formBuilder.group({
            content_name: ['', Validators.required],
            fields: new FormArray([fieldGroup])
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
