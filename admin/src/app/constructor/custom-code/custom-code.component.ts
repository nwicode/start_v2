import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {ContentService} from "../../services/content.service";
import {TranslationService} from "../../services/translation.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ApplicationService} from "../../services/application.service";
import {LayoutService} from "../../services/layout.service";
import {SubheaderService} from "../ConstructorComponents/subheader/_services/subheader.service";

@Component({
  selector: 'app-custom-code',
  templateUrl: './custom-code.component.html',
  styleUrls: ['./custom-code.component.scss']
})
export class CustomCodeComponent implements OnInit {

  pages: any[];
  isLoading$: Observable<boolean>;

  applicationId: number;

  constructor(private appService: ApplicationService, private layoutService: LayoutService, private translate: TranslationService, private subheader: SubheaderService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.applicationId = Number(this.router.url.match(/constructor\/(\d+)/)[1]);

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

      this.layoutService.getPages(this.applicationId).then(response => {
        this.pages = [];
        for (let i = 0; i < response.pages.length; i++) {
          if (response.pages[i].type !== 'start') {
            this.pages.push(response.pages[i]);
          }
        }
        observer.next(false);

        if (this.pages.length > 0) {
          this.router.navigate([`page`, this.pages[0].id], {relativeTo: this.activatedRoute});
        } else {
          this.router.navigate(['/constructor/' + this.applicationId + '/custom-code'], {relativeTo: this.activatedRoute});
        }
      });
    });
  }

}
