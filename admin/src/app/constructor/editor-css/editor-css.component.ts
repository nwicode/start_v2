/// <reference path="../../../../node_modules/monaco-editor/monaco.d.ts" />
import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {TranslationService} from "../../services/translation.service";
import {SubheaderService} from "../ConstructorComponents/subheader/_services/subheader.service";
import {ToastService} from "../../platform/framework/core/services/toast.service";
import {Router} from "@angular/router";
import {ApplicationService} from "../../services/application.service";

@Component({
  selector: 'app-editor-css',
  templateUrl: './editor-css.component.html',
  styleUrls: ['./editor-css.component.scss']
})
export class EditorCssComponent implements OnInit {

  isLoading$: Observable<boolean>;

  applicationId: number;

  initCode = '';
  codeEditorInstance: monaco.editor.IStandaloneCodeEditor;

  constructor(private translationService: TranslationService, private subheader: SubheaderService, private toastService: ToastService, private router: Router, private applicationService: ApplicationService) { }

  ngOnInit(): void {
    this.applicationId = Number(this.router.url.match(/constructor\/(\d+)/)[1]);

    setTimeout(() => {
      this.subheader.setTitle('CONSTRUCTOR.EDITOR_CSS.TITLE');
      this.subheader.setBreadcrumbs([{
        title: 'CONSTRUCTOR.EDITOR_CSS.TITLE',
        linkText: 'CONSTRUCTOR.EDITOR_CSS.TITLE',
        linkPath: '/constructor/' + this.applicationId + '/editor-css'
      }]);
    }, 1);

    this.isLoading$ = new Observable<boolean>( observer => {
      observer.next(true);

      this.applicationService.getApplicationCss(this.applicationId).then(response => {
        this.initCode = response.application_css;
        this.initMonaco();

        observer.next(false);
      });
    });

  }

  /**
   * Initialize monaco editor.
   */
  initMonaco(): void {
    this.codeEditorInstance = monaco.editor.create(document.getElementById('container'), {
      value: this.initCode,
      language: 'css',
      automaticLayout: true,
      theme: 'vs-dark'
    });

  }

  /**
   * Save changes in editor.
   */
  save() {
    this.isLoading$ = new Observable<boolean>( observer => {
      observer.next(true);
      this.applicationService.setApplicationCss(this.applicationId, this.codeEditorInstance.getValue()).then(response => {
        if (response.is_error) {
          this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_NOT_SAVED'), 'danger');
        } else {
          this.initCode = this.codeEditorInstance.getValue();
          this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_SAVED'), 'success');
        }
        observer.next(false);
      });
    });
  }

  /**
   * Remove changes in editor.
   */
  cancel() {
    this.codeEditorInstance.setValue(this.initCode);
  }
}
