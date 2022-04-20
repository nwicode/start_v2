import { Component, OnInit } from '@angular/core';
import { TranslationService } from '../../../../services/translation.service';
import { ContentService } from '../../../../services/content.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { SubheaderService } from '../../../LayoutsComponents/subheader/_services/subheader.service';
import { ToastService } from '../../../framework/core/services/toast.service';

@Component({
  selector: 'app-static-page-editor',
  templateUrl: './static-page-editor.component.html',
  styleUrls: ['./static-page-editor.component.scss']
})
export class StaticPageEditorComponent implements OnInit {

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

  async ngOnInit(){
    await this.translationService.readLanguages();
    this.currentAppLanguage = this.translationService.getSelectedLanguage();
    this.selectedIndex = 0;

    this.isLoading$ = new Observable<boolean>( observer => {
      observer.next(true);
      this.route.params.subscribe(params => {
        this.contentService.downloadStaticPage(params.code).then(response => {
          this.pages = [];
          this.firstStatePages = [];

          this.macros = response.macros;

          for (const page of response.pages) {
            this.pages.push(Object.assign({}, page));
            this.firstStatePages.push(Object.assign({}, page));

            this.header = page.header;
          }

          this.subheader.setTitle(this.header);
          this.subheader.setBreadcrumbs([{
            title: 'STATIC_PAGE.STATIC_PAGES',
            linkText: 'STATIC_PAGE.STATIC_PAGES',
            linkPath: '/static-pages'
          }]);

          observer.next(false);
        });
      });
    });
  }

  /**
   * Save changes in all tabs.
   */
  save() {
    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      this.contentService.updateStaticPages(this.pages).then((response) => {
        console.log(response);
        observer.next(false);
        if (response.is_error) {
          this.toastService.showsToastBar(this.translationService.translatePhrase('STATIC_PAGE.TEXT_NOT_UPDATED'), 'warning');
        } else {
          this.toastService.showsToastBar(this.translationService.translatePhrase('STATIC_PAGE.TEXT_UPDATED'), 'success');
          for(let i = 0; i < this.pages.length; i++) {
            this.firstStatePages[i].content = this.pages[i].content;
          }
        }
      });
    });
  }

  /**
   * Remove changes in all tabs.
   */
  cancel() {
    for(let i = 0; i < this.firstStatePages.length; i++) {
      this.pages[i].content = this.firstStatePages[i].content;
    }
  }
}
