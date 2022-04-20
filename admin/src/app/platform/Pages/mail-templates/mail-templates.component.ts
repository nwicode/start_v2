import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {ContentService} from "../../../services/content.service";
import {TranslationService} from "../../../services/translation.service";
import {SubheaderService} from "../../LayoutsComponents/subheader/_services/subheader.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-mail-templates',
  templateUrl: './mail-templates.component.html',
  styleUrls: ['./mail-templates.component.scss']
})
export class MailTemplatesComponent implements OnInit {

  mailTemplateCodes = [
      'MAIL_REGISTRATION_TEMPLATE',
      'MAIL_RESTORE_PASSWORD_TEMPLATE'
  ];

  headers: any[] = [];
  headers_c: any[] = [];
  isLoading$: Observable<boolean>;

  constructor(private contentService: ContentService, private translate: TranslationService, private subheader: SubheaderService, private router: Router) { }

  async ngOnInit(): Promise<void> {
    await this.translate.readLanguages()
    setTimeout(() => {
      this.subheader.setTitle('MAIL.TEMPLATE.MAIL_TEMPLATES');
    }, 1);

    this.isLoading$ = new Observable<boolean>( observer => {
      observer.next(true);
      this.contentService.downloadStaticPagesHeaders(this.translate.getSelectedLanguage()).then(response => {
        // this.headers = response;

        console.log("mail templates response");
        console.log(response);

        response.map(h => {
          if (this.mailTemplateCodes.includes(h.code) && !this.headers_c.includes(h.code)) {
            this.headers.push(h);
            this.headers_c.push(h.code);
          }
        })

        observer.next(false);

        if (this.router.url === '/mail-templates' && this.headers.length > 0) {
          this.router.navigate([`/mail-templates/${this.headers[0].code}`]);
        }
      })
    });
  }
}
