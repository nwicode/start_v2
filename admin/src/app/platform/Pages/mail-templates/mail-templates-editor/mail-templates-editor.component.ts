import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {ContentService} from "../../../../services/content.service";
import {TranslationService} from "../../../../services/translation.service";
import {SubheaderService} from "../../../LayoutsComponents/subheader/_services/subheader.service";
import {ToastService} from "../../../framework/core/services/toast.service";

@Component({
  selector: 'app-mail-templates-editor',
  templateUrl: './mail-templates-editor.component.html',
  styleUrls: ['./mail-templates-editor.component.scss']
})
export class MailTemplatesEditorComponent implements OnInit {

  pages: { code: string, content: string, header: string, pageCode: string }[] = [];
  firstStatePages: { code: string, content: string, header: string, pageCode: string }[] = [];
  macros: any[] = [];
  currentAppLanguage: string;
  header: string;
  isLoading$: Observable<boolean>;
  selectedIndex = 0;

  constructor(private route: ActivatedRoute, private contentService: ContentService,
              private translationService: TranslationService, private subheader: SubheaderService,
              private toastService: ToastService) { }

  ngOnInit(): void {
    this.currentAppLanguage = this.translationService.getSelectedLanguage();
    this.selectedIndex = 0;

    this.isLoading$ = new Observable<boolean>( observer => {
      observer.next(true);
      this.route.params.subscribe(params => {
        this.contentService.getMailStaticPage(params.code).then(response => {
          this.pages = [];
          this.firstStatePages = [];
          this.macros = response.macros;

          for (const page of response.pages) {
            this.pages.push(Object.assign({}, page));
            this.firstStatePages.push(Object.assign({}, page));

            if (page.code === this.currentAppLanguage) {
              this.header = page.header;
            }
          }

          this.subheader.setTitle(this.header);
          this.subheader.setBreadcrumbs([{
            title: 'MAIL.TEMPLATE.MAIL_TEMPLATES',
            linkText: 'MAIL.TEMPLATE.MAIL_TEMPLATES',
            linkPath: '/mail-templates'
          }]);

          observer.next(false);
        });
      });
    });
  }

  /**
   * Save changes in current tab.
   */
  save() {
    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      console.log('updateStaticPage', [this.pages[this.selectedIndex]]);
      this.contentService.updateStaticPages([this.pages[this.selectedIndex]]).then((response) => {
        observer.next(false);
        if (response.is_error) {
          this.toastService.showsToastBar(this.translationService.translatePhrase('MAIL.TEMPLATE.TEMPLATE_NOT_UPDATED'), 'warning');
        } else {
          this.toastService.showsToastBar(this.translationService.translatePhrase('MAIL.TEMPLATE.TEMPLATE_UPDATED'), 'success');
          this.firstStatePages[this.selectedIndex] = Object.assign({}, this.pages[this.selectedIndex]);
        }
      });
    });
  }

  /**
   * Remove changes in current tab.
   */
  cancel() {
    this.pages[this.selectedIndex] = Object.assign({}, this.firstStatePages[this.selectedIndex]);
  }

}
