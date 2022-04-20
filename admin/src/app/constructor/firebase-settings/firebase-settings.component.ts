/// <reference path="../../../../node_modules/monaco-editor/monaco.d.ts" />
import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {FormBuilder, FormGroup} from "@angular/forms";
import {TranslationService} from "../../services/translation.service";
import {SubheaderService} from "../ConstructorComponents/subheader/_services/subheader.service";
import {ToastService} from "../../platform/framework/core/services/toast.service";
import {Router} from "@angular/router";
import {ApplicationService} from "../../services/application.service";

@Component({
  selector: 'app-firebase-settings',
  templateUrl: './firebase-settings.component.html',
  styleUrls: ['./firebase-settings.component.scss']
})
export class FirebaseSettingsComponent implements OnInit {

  isLoading$: Observable<boolean>;
  formGroup: FormGroup;

  applicationId: number;

  google_services_json: string;
  google_services_plist: string;
  use_crashlytics: boolean;

  jsonCodeEditorInstance: monaco.editor.IStandaloneCodeEditor;
  xmlCodeEditorInstance: monaco.editor.IStandaloneCodeEditor;

  constructor(private translationService: TranslationService, private subheader: SubheaderService, private toastService: ToastService, private formBuilder: FormBuilder, private router: Router, private applicationService: ApplicationService) { }

  ngOnInit(): void {
    this.applicationId = Number(this.router.url.match(/constructor\/(\d+)/)[1]);

    setTimeout(() => {
      this.subheader.setTitle('CONSTRUCTOR.FIREBASE_SETTINGS.TITLE');
      this.subheader.setBreadcrumbs([{
        title: 'CONSTRUCTOR.FIREBASE_SETTINGS.TITLE',
        linkText: 'CONSTRUCTOR.FIREBASE_SETTINGS.TITLE',
        linkPath: '/constructor/' + this.applicationId + '/firebase-settings'
      }]);
    }, 1);

    this.isLoading$ = new Observable<boolean>( observer => {
      observer.next(true);

      this.applicationService.getFirebaseSettings(this.applicationId).then(result => {
        this.google_services_json = result.google_services_json;
        this.google_services_plist = result.google_services_plist;
        this.use_crashlytics = result.use_crashlytics;

        this.initMonaco();

        this.loadForm();
        observer.next(false);
      });
    });
  }

  /**
   * Initialize monaco editor.
   */
  initMonaco(): void {
    this.jsonCodeEditorInstance = monaco.editor.create(document.getElementById('containerJSONEditor'), {
      value: this.google_services_json,
      language: 'json',
      automaticLayout: true,
      theme: 'vs-dark'
    });

    this.xmlCodeEditorInstance = monaco.editor.create(document.getElementById('containerXMLEditor'), {
      value: this.google_services_plist,
      language: 'xml',
      automaticLayout: true,
      theme: 'vs-dark'
    });
  }

  /**
   * Initialize form.
   */
  loadForm() {
    this.formGroup = this.formBuilder.group({
      use_crashlytics: [this.use_crashlytics]
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

    const formValues = this.formGroup.value;
    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      this.formGroup.disable();

      this.applicationService.setFirebaseSettings(this.applicationId, this.jsonCodeEditorInstance.getValue(), this.xmlCodeEditorInstance.getValue(), formValues.use_crashlytics).then(result => {
        if (result.is_error) {
          this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_NOT_SAVED'), 'danger');
        } else {
          this.google_services_json = result.google_services_json;
          this.google_services_plist = result.google_services_plist;
          this.use_crashlytics = result.use_crashlytics;

          this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_SAVED'), 'success');
        }

        this.formGroup.enable();
        observer.next(false);
      });

    });
  }

  /**
   * Remove changes.
   */
  cancel() {
    this.isLoading$ = new Observable<boolean>( observer => {
      observer.next(true);

      this.jsonCodeEditorInstance.setValue(this.google_services_json);
      this.xmlCodeEditorInstance.setValue(this.google_services_plist);

      this.loadForm();
      observer.next(false);
    });
  }

}
