import { Component, OnInit } from '@angular/core';
import { ContentService } from '../../../services/content.service';
import { TranslationService } from '../../../services/translation.service';
import { SubheaderService } from '../../LayoutsComponents/subheader/_services/subheader.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-static-pages',
  templateUrl: './static-pages.component.html',
  styleUrls: ['./static-pages.component.scss']
})
export class StaticPagesComponent implements OnInit {

  staticPageHeaderStarts = 'STATIC_PAGE.';

  headers: any[] = [];
  isLoading$: Observable<boolean>;

  constructor(private contentService: ContentService, private translate: TranslationService, private subheader: SubheaderService, private router: Router) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.subheader.setTitle('STATIC_PAGE.STATIC_PAGES');
      this.subheader.setBreadcrumbs([{
        title: 'STATIC_PAGE.STATIC_PAGES',
        linkText: 'STATIC_PAGE.STATIC_PAGES',
        linkPath: '/static-pages'
      }]);
    }, 1);

    this.isLoading$ = new Observable<boolean>( observer => {
      observer.next(true);
      this.contentService.downloadStaticPagesHeaders(this.translate.getSelectedLanguage()).then(response => {
        response.map(header => {
          if (header.header.startsWith(this.staticPageHeaderStarts) && header.lang_code === 'en') {
            this.headers.push(header);
          }
        });
        observer.next(false);

        if (this.router.url === '/static-pages' && this.headers.length > 0) {
          this.router.navigate([`/static-pages/${this.headers[0].code}`]);
        }
      });
    });
  }

}
