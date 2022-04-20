/// <reference path="../../../../../node_modules/monaco-editor/monaco.d.ts" />
import { Component, OnInit } from '@angular/core';
import {LayoutService} from "../../../services/layout.service";
import {Observable} from "rxjs";
import {TranslationService} from "../../../services/translation.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastService} from "../../../platform/framework/core/services/toast.service";
import {SubheaderService} from "../../ConstructorComponents/subheader/_services/subheader.service";

export interface PageCustomCodeValues {
  id: number|string,
  page_id: number|string,
  import_section: string,
  variables: string,
  define_constructor_objects: string,
  constructor_code: string,
  user_functions: string,
  on_init: string,
  on_destroy: string,
  ion_view_will_enter: string,
  ion_view_did_enter: string,
  ion_view_will_leave: string,
  ion_view_did_leave: string,
  header: string,
  menu: string,
  content_before: string,
  content_after: string,
  footer: string,
  scss: string
}

@Component({
  selector: 'app-custom-code-editor',
  templateUrl: './custom-code-editor.component.html',
  styleUrls: ['./custom-code-editor.component.scss']
})
export class CustomCodeEditorComponent implements OnInit {

  isLoading$: Observable<boolean>;

  applicationId: number;
  appPageId: number;

  isInitTab: boolean[] = [false, false, false];
  oldValues: PageCustomCodeValues = {
    constructor_code: "",
    content_after: "",
    content_before: "",
    define_constructor_objects: "",
    footer: "",
    header: "",
    menu: "",
    id: undefined,
    import_section: "",
    ion_view_did_enter: "",
    ion_view_did_leave: "",
    ion_view_will_enter: "",
    ion_view_will_leave: "",
    on_init: "",
    on_destroy: "",
    page_id: undefined,
    scss: "",
    user_functions: "",
    variables: ""
  };
  selectedIndex: number = 0;

  //tab 1
  importSectionEditorInstance: monaco.editor.IStandaloneCodeEditor;
  variablesEditorInstance: monaco.editor.IStandaloneCodeEditor;
  defineConstructorObjectsEditorInstance: monaco.editor.IStandaloneCodeEditor;
  constructorEditorInstance: monaco.editor.IStandaloneCodeEditor;
  onInitEditorInstance: monaco.editor.IStandaloneCodeEditor;
  onDestroyEditorInstance: monaco.editor.IStandaloneCodeEditor;
  ionViewWillEnterEditorInstance: monaco.editor.IStandaloneCodeEditor;
  ionViewDidEnterEditorInstance: monaco.editor.IStandaloneCodeEditor;
  ionViewWillLeaveEditorInstance: monaco.editor.IStandaloneCodeEditor;
  ionViewDidLeaveEditorInstance: monaco.editor.IStandaloneCodeEditor;
  userFunctionsEditorInstance: monaco.editor.IStandaloneCodeEditor;
  //tab 2
  headerEditorInstance: monaco.editor.IStandaloneCodeEditor;
  menuEditorInstance: monaco.editor.IStandaloneCodeEditor;
  contentBeforeEditorInstance: monaco.editor.IStandaloneCodeEditor;
  contentAfterEditorInstance: monaco.editor.IStandaloneCodeEditor;
  footerEditorInstance: monaco.editor.IStandaloneCodeEditor;
  //tab 3
  scssEditorInstance: monaco.editor.IStandaloneCodeEditor;

  constructor(private layoutService: LayoutService, private activateRoute: ActivatedRoute, private translationService: TranslationService, private subheader: SubheaderService, private router: Router, private toastService: ToastService) { }

  ngOnInit(): void {
    this.applicationId = Number(this.router.url.match(/constructor\/(\d+)/)[1]);
    this.appPageId = this.activateRoute.snapshot.params['page_id'];


    this.activateRoute.params.subscribe(params => {
      this.appPageId = params.page_id;
      setTimeout(() => {
        this.subheader.setTitle('CONSTRUCTOR.CUSTOM_CODE.TITLE');
        this.subheader.setBreadcrumbs([{
          title: 'CONSTRUCTOR.CUSTOM_CODE.TITLE',
          linkText: 'CONSTRUCTOR.CUSTOM_CODE.TITLE',
          linkPath: '/constructor/' + this.applicationId + '/custom-code'
        }]);
      }, 1);
      this.isLoading$ = new Observable<boolean>( observer => {
        observer.next(true);
        this.changeEditorsReadOnlyOption(true);

        this.layoutService.getPageCustomCode(this.applicationId, this.appPageId).then(response => {
          if (!response.is_error) {
            if (response.code_values) {
              this.oldValues = response.code_values;
            } else {
                this.oldValues = {
                    constructor_code: "",
                    content_after: "",
                    content_before: "",
                    define_constructor_objects: "",
                    footer: "",
                    header: "",
                    menu: "",
                    id: undefined,
                    import_section: "",
                    ion_view_did_enter: "",
                    ion_view_did_leave: "",
                    ion_view_will_enter: "",
                    ion_view_will_leave: "",
                    on_init: "",
                    on_destroy: "",
                    page_id: undefined,
                    scss: "",
                    user_functions: "",
                    variables: ""
                };
            }
            this.setEditorsValue();
            this.initMonacoFirstTab();
            this.changeEditorsReadOnlyOption(false);
            observer.next(false);
          }
        });
      });
    });

  }

  /**
   * Initialize monaco editor in first tab.
   */
  initMonacoFirstTab(): void {
    if (!this.isInitTab[0]) {
      this.isInitTab[0] = true;
      this.importSectionEditorInstance = monaco.editor.create(document.getElementById('importSectionContainer'), {
        value: this.oldValues.import_section,
        language: 'typescript',
        automaticLayout: true,
        theme: 'vs-dark'
      });

      this.variablesEditorInstance = monaco.editor.create(document.getElementById('variablesContainer'), {
        value: this.oldValues.variables,
        language: 'typescript',
        automaticLayout: true,
        theme: 'vs-dark'
      });

      this.defineConstructorObjectsEditorInstance = monaco.editor.create(document.getElementById('defineConstructorObjectsContainer'), {
        value: this.oldValues.define_constructor_objects,
        language: 'typescript',
        automaticLayout: true,
        theme: 'vs-dark'
      });

      this.constructorEditorInstance = monaco.editor.create(document.getElementById('constructorContainer'), {
        value: this.oldValues.constructor_code,
        language: 'typescript',
        automaticLayout: true,
        theme: 'vs-dark'
      });

      this.onInitEditorInstance = monaco.editor.create(document.getElementById('onInitContainer'), {
        value: this.oldValues.on_init,
        language: 'typescript',
        automaticLayout: true,
        theme: 'vs-dark'
      });

      this.onDestroyEditorInstance = monaco.editor.create(document.getElementById('onDestroyContainer'), {
        value: this.oldValues.on_destroy,
        language: 'typescript',
        automaticLayout: true,
        theme: 'vs-dark'
      });

      this.ionViewWillEnterEditorInstance = monaco.editor.create(document.getElementById('ionViewWillEnterContainer'), {
        value: this.oldValues.ion_view_will_enter,
        language: 'typescript',
        automaticLayout: true,
        theme: 'vs-dark'
      })

      this.ionViewDidEnterEditorInstance = monaco.editor.create(document.getElementById('ionViewDidEnterContainer'), {
        value: this.oldValues.ion_view_did_enter,
        language: 'typescript',
        automaticLayout: true,
        theme: 'vs-dark'
      });

      this.ionViewDidLeaveEditorInstance = monaco.editor.create(document.getElementById('ionViewDidLeaveContainer'), {
        value: this.oldValues.ion_view_did_leave,
        language: 'typescript',
        automaticLayout: true,
        theme: 'vs-dark'
      });

      this.ionViewWillLeaveEditorInstance = monaco.editor.create(document.getElementById('ionViewWillLeaveContainer'), {
        value: this.oldValues.ion_view_will_leave,
        language: 'typescript',
        automaticLayout: true,
        theme: 'vs-dark'
      });

      this.userFunctionsEditorInstance = monaco.editor.create(document.getElementById('userFunctionsContainer'), {
        value: this.oldValues.user_functions,
        language: 'typescript',
        automaticLayout: true,
        theme: 'vs-dark'
      });
    }
  }

  /**
   * Initialize monaco editor in second tab.
   */
  initMonacoSecondTab(): void {
    if (!this.isInitTab[1]) {
      this.isInitTab[1] = true;
      this.headerEditorInstance = monaco.editor.create(document.getElementById('headerContainer'), {
        value: this.oldValues.header,
        language: 'html',
        automaticLayout: true,
        theme: 'vs-dark'
      });

      this.menuEditorInstance = monaco.editor.create(document.getElementById('menuContainer'), {
        value: this.oldValues.menu,
        language: 'html',
        automaticLayout: true,
        theme: 'vs-dark'
      });

      this.contentBeforeEditorInstance = monaco.editor.create(document.getElementById('contentBeforeContainer'), {
        value: this.oldValues.content_before,
        language: 'html',
        automaticLayout: true,
        theme: 'vs-dark'
      });

      this.contentAfterEditorInstance = monaco.editor.create(document.getElementById('contentAfterContainer'), {
        value: this.oldValues.content_after,
        language: 'html',
        automaticLayout: true,
        theme: 'vs-dark'
      });

      this.footerEditorInstance = monaco.editor.create(document.getElementById('footerContainer'), {
        value: this.oldValues.footer,
        language: 'html',
        automaticLayout: true,
        theme: 'vs-dark'
      });
    }
  }

  /**
   * Initialize monaco editor in third tab.
   */
  initMonacoThirdTab(): void {
    if (!this.isInitTab[2]) {
      this.isInitTab[2] = true;
      this.scssEditorInstance = monaco.editor.create(document.getElementById('scssContainer'), {
        value: this.oldValues.scss,
        language: 'scss',
        automaticLayout: true,
        theme: 'vs-dark'
      });
    }
  }

  /**
   * Save changes.
   */
  save() {
    this.isLoading$ = new Observable<boolean>( observer => {
      observer.next(true);
      this.changeEditorsReadOnlyOption(true);

      let values = this.getEditorsValue();
      this.layoutService.setPageCustomCode(this.applicationId, this.appPageId, values).then(response => {
        if (response.is_error) {
          this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_NOT_SAVED'), 'danger');
        } else {
          this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_SAVED'), 'success');
          this.oldValues = values;
        }
        this.changeEditorsReadOnlyOption(false);
        observer.next(false);
      });
    });
  }

  /**
   * Remove changes.
   */
  cancel() {
    if (this.importSectionEditorInstance) this.importSectionEditorInstance.setValue(this.oldValues.import_section);
    if (this.variablesEditorInstance) this.variablesEditorInstance.setValue(this.oldValues.variables);
    if (this.defineConstructorObjectsEditorInstance) this.defineConstructorObjectsEditorInstance.setValue(this.oldValues.define_constructor_objects);
    if (this.constructorEditorInstance) this.constructorEditorInstance.setValue(this.oldValues.constructor_code);
    if (this.onInitEditorInstance) this.onInitEditorInstance.setValue(this.oldValues.on_init);
    if (this.onDestroyEditorInstance) this.onDestroyEditorInstance.setValue(this.oldValues.on_destroy);
    if (this.ionViewWillEnterEditorInstance) this.ionViewWillEnterEditorInstance.setValue(this.oldValues.ion_view_will_enter);
    if (this.ionViewDidEnterEditorInstance) this.ionViewDidEnterEditorInstance.setValue(this.oldValues.ion_view_did_enter);
    if (this.ionViewWillLeaveEditorInstance) this.ionViewWillLeaveEditorInstance.setValue(this.oldValues.ion_view_will_leave);
    if (this.ionViewDidLeaveEditorInstance) this.ionViewDidLeaveEditorInstance.setValue(this.oldValues.ion_view_did_leave);
    if (this.userFunctionsEditorInstance) this.userFunctionsEditorInstance.setValue(this.oldValues.user_functions);
    if (this.headerEditorInstance) this.headerEditorInstance.setValue(this.oldValues.header);
    if (this.menuEditorInstance) this.menuEditorInstance.setValue(this.oldValues.menu);
    if (this.contentBeforeEditorInstance) this.contentBeforeEditorInstance.setValue(this.oldValues.content_before);
    if (this.contentAfterEditorInstance) this.contentAfterEditorInstance.setValue(this.oldValues.content_after);
    if (this.footerEditorInstance) this.footerEditorInstance.setValue(this.oldValues.footer);
    if (this.scssEditorInstance) this.scssEditorInstance.setValue(this.oldValues.scss);

  }

  /**
   * Change tab event.
   */
  selectedTabChange() {
    if (this.selectedIndex === 0) {
      this.initMonacoFirstTab();
    } else if (this.selectedIndex === 1) {
      this.initMonacoSecondTab();
    } else if (this.selectedIndex === 2) {
      this.initMonacoThirdTab();
    }
  }

  /**
   * Get editors value.
   */
  getEditorsValue() {
    let values: PageCustomCodeValues = {
      constructor_code: this.constructorEditorInstance ? this.constructorEditorInstance.getValue() : this.oldValues.constructor_code,
      content_after: this.contentAfterEditorInstance ? this.contentAfterEditorInstance.getValue() : this.oldValues.content_after,
      content_before: this.contentBeforeEditorInstance ? this.contentBeforeEditorInstance.getValue() : this.oldValues.content_before,
      define_constructor_objects: this.defineConstructorObjectsEditorInstance ? this.defineConstructorObjectsEditorInstance.getValue() : this.oldValues.define_constructor_objects,
      footer: this.footerEditorInstance ? this.footerEditorInstance.getValue() : this.oldValues.footer,
      header: this.headerEditorInstance ? this.headerEditorInstance.getValue() : this.oldValues.header,
      menu: this.menuEditorInstance ? this.menuEditorInstance.getValue() : this.oldValues.menu,
      id: this.oldValues.id,
      import_section: this.importSectionEditorInstance ? this.importSectionEditorInstance.getValue() : this.oldValues.import_section,
      ion_view_did_enter: this.ionViewDidEnterEditorInstance ? this.ionViewDidEnterEditorInstance.getValue() : this.oldValues.ion_view_did_enter,
      ion_view_did_leave: this.ionViewDidLeaveEditorInstance ? this.ionViewDidLeaveEditorInstance.getValue() : this.oldValues.ion_view_did_leave,
      ion_view_will_enter: this.ionViewWillEnterEditorInstance ? this.ionViewWillEnterEditorInstance.getValue() : this.oldValues.ion_view_will_enter,
      ion_view_will_leave: this.ionViewWillLeaveEditorInstance ? this.ionViewWillLeaveEditorInstance.getValue() : this.oldValues.ion_view_will_leave,
      on_init: this.onInitEditorInstance ? this.onInitEditorInstance.getValue() : this.oldValues.on_init,
      on_destroy: this.onDestroyEditorInstance ? this.onDestroyEditorInstance.getValue() : this.oldValues.on_destroy,
      page_id: this.oldValues.page_id,
      scss: this.scssEditorInstance ? this.scssEditorInstance.getValue() : this.oldValues.scss,
      user_functions: this.userFunctionsEditorInstance ? this.userFunctionsEditorInstance.getValue() : this.oldValues.user_functions,
      variables: this.variablesEditorInstance ? this.variablesEditorInstance.getValue() : this.oldValues.variables
    };

    return values;
  }

  /**
   * Set editors value.
   */
  setEditorsValue() {
    if (this.constructorEditorInstance) this.constructorEditorInstance.setValue(this.oldValues.constructor_code);
    if (this.contentAfterEditorInstance) this.contentAfterEditorInstance.setValue(this.oldValues.content_after);
    if (this.contentBeforeEditorInstance) this.contentBeforeEditorInstance.setValue(this.oldValues.content_before);
    if (this.defineConstructorObjectsEditorInstance) this.defineConstructorObjectsEditorInstance.setValue(this.oldValues.define_constructor_objects);
    if (this.footerEditorInstance) this.footerEditorInstance.setValue(this.oldValues.footer);
    if (this.headerEditorInstance) this.headerEditorInstance.setValue(this.oldValues.header);
    if (this.menuEditorInstance) this.menuEditorInstance.setValue(this.oldValues.menu);
    if (this.importSectionEditorInstance) this.importSectionEditorInstance.setValue(this.oldValues.import_section);
    if (this.ionViewDidEnterEditorInstance) this.ionViewDidEnterEditorInstance.setValue(this.oldValues.ion_view_did_enter);
    if (this.ionViewDidLeaveEditorInstance) this.ionViewDidLeaveEditorInstance.setValue(this.oldValues.ion_view_did_leave);
    if (this.ionViewWillEnterEditorInstance) this.ionViewWillEnterEditorInstance.setValue(this.oldValues.ion_view_will_enter);
    if (this.ionViewWillLeaveEditorInstance) this.ionViewWillLeaveEditorInstance.setValue(this.oldValues.ion_view_will_leave);
    if (this.onInitEditorInstance) this.onInitEditorInstance.setValue(this.oldValues.on_init);
    if (this.onDestroyEditorInstance) this.onDestroyEditorInstance.setValue(this.oldValues.on_destroy);
    if (this.scssEditorInstance) this.scssEditorInstance.setValue(this.oldValues.scss);
    if (this.userFunctionsEditorInstance) this.userFunctionsEditorInstance.setValue(this.oldValues.user_functions);
    if (this.variablesEditorInstance) this.variablesEditorInstance.setValue(this.oldValues.variables);
  }

  changeEditorsReadOnlyOption(isReadOnly: boolean) {
    if (this.isInitTab[0]) {
      this.importSectionEditorInstance.updateOptions({readOnly: isReadOnly});
      this.variablesEditorInstance.updateOptions({readOnly: isReadOnly});
      this.defineConstructorObjectsEditorInstance.updateOptions({readOnly: isReadOnly});
      this.constructorEditorInstance.updateOptions({readOnly: isReadOnly});
      this.onInitEditorInstance.updateOptions({readOnly: isReadOnly});
      this.onDestroyEditorInstance.updateOptions({readOnly: isReadOnly});
      this.ionViewWillEnterEditorInstance.updateOptions({readOnly: isReadOnly});
      this.ionViewDidEnterEditorInstance.updateOptions({readOnly: isReadOnly});
      this.ionViewWillLeaveEditorInstance.updateOptions({readOnly: isReadOnly});
      this.ionViewDidLeaveEditorInstance.updateOptions({readOnly: isReadOnly});
      this.userFunctionsEditorInstance.updateOptions({readOnly: isReadOnly});
    }

    if (this.isInitTab[1]) {
      this.headerEditorInstance.updateOptions({readOnly: isReadOnly});
      this.menuEditorInstance.updateOptions({readOnly: isReadOnly});
      this.contentBeforeEditorInstance.updateOptions({readOnly: isReadOnly});
      this.contentAfterEditorInstance.updateOptions({readOnly: isReadOnly});
      this.footerEditorInstance;
    }

    if (this.isInitTab[2]) {
      this.scssEditorInstance.updateOptions({readOnly: isReadOnly});
    }
  }
}
