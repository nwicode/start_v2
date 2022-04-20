/// <reference path="../../../../node_modules/monaco-editor/monaco.d.ts" />
import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {TranslationService} from "../../services/translation.service";
import {SubheaderService} from "../ConstructorComponents/subheader/_services/subheader.service";
import {ToastService} from "../../platform/framework/core/services/toast.service";
import {Router} from "@angular/router";
import {ApplicationService} from "../../services/application.service";

@Component({
  selector: 'app-custom-start-animation',
  templateUrl: './custom-start-animation.component.html',
  styleUrls: ['./custom-start-animation.component.scss']
})
export class CustomStartAnimationComponent implements OnInit {

  isLoading$: Observable<boolean>;

  applicationId: number;

  initHtmlCode = '';
  initCssCode = '';

  htmlCodeEditorInstance: monaco.editor.IStandaloneCodeEditor;
  cssCodeEditorInstance: monaco.editor.IStandaloneCodeEditor;

  constructor(private translationService: TranslationService, private subheader: SubheaderService, private toastService: ToastService, private router: Router, private applicationService: ApplicationService) { }

  ngOnInit(): void {
    this.applicationId = Number(this.router.url.match(/constructor\/(\d+)/)[1]);

    setTimeout(() => {
      this.subheader.setTitle('CONSTRUCTOR.CUSTOM_START_ANIMATION.TITLE');
      this.subheader.setBreadcrumbs([{
        title: 'CONSTRUCTOR.CUSTOM_START_ANIMATION.TITLE',
        linkText: 'CONSTRUCTOR.CUSTOM_START_ANIMATION.TITLE',
        linkPath: '/constructor/' + this.applicationId + '/custom-start-animation'
      }]);
    }, 1);

    this.isLoading$ = new Observable<boolean>( observer => {
      observer.next(true);

      this.applicationService.getCustomStartAnimationSettings(this.applicationId).then(response => {
        this.initHtmlCode = response.html;
        this.initCssCode = response.css;

        this.initMonaco();

        observer.next(false);
      });
    });

  }

  /**
   * Initialize monaco editor.
   */
  initMonaco(): void {
    this.htmlCodeEditorInstance = monaco.editor.create(document.getElementById('containerHTMLEditor'), {
      value: this.initHtmlCode,
      language: 'html',
      automaticLayout: true,
      theme: 'vs-dark'
    });

    this.cssCodeEditorInstance = monaco.editor.create(document.getElementById('containerCSSEditor'), {
      value: this.initCssCode,
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
      this.applicationService.setCustomStartAnimationSettings(this.applicationId, this.htmlCodeEditorInstance.getValue(), this.cssCodeEditorInstance.getValue()).then(response => {
        if (response.is_error) {
          this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_NOT_SAVED'), 'danger');
        } else {
          this.initHtmlCode = this.htmlCodeEditorInstance.getValue();
          this.initCssCode = this.cssCodeEditorInstance.getValue();
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
    this.htmlCodeEditorInstance.setValue(this.initHtmlCode);
    this.cssCodeEditorInstance.setValue(this.initCssCode);
  }

}
