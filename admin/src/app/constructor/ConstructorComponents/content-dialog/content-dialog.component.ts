import { Component, OnInit } from '@angular/core';
import {ApplicationService} from "../../../services/application.service";
import {Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TranslationService} from "../../../services/translation.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-content-dialog',
  templateUrl: './content-dialog.component.html',
  styleUrls: ['./content-dialog.component.scss']
})
export class ContentDialogComponent implements OnInit {

  title: string = "";
  applicationId: any;
  contentTypeLoaded: boolean = false;
  contentLoading: Observable<boolean>;

  selectedContentType: any;
  selectedContent: any;

  contentTypeList: any[] = [];
  contentList: any[] = [];

  constructor(private applicationService: ApplicationService, private router: Router, private modalService: NgbModal, private translate: TranslationService) { }

  ngOnInit(): void {
    this.applicationId = Number(this.router.url.match(/constructor\/(\d+)/)[1]);
    this.title = this.translate.translatePhrase('CONSTRUCTOR.CONTENT_DIALOG.TITLE');

    this.applicationService.getApplicationContentTypesList(this.applicationId).then(response => {
      console.log(response);
      this.contentTypeList = response.content_types;
      this.contentTypeLoaded = true;
    });
  }

  save() {
    if (this.selectedContentType && this.selectedContent) {
      this.modalService.dismissAll({'contentType': this.selectedContentType, 'content': this.selectedContent});
    }
  }

  close () {
    this.modalService.dismissAll({});
  }

  openContent(contentTypeIndex: number) {
    this.contentLoading = new Observable<boolean>(observer => {
      observer.next(false);
      this.selectedContentType = this.contentTypeList[contentTypeIndex];
      this.applicationService.getApplicationContentList(this.applicationId, this.contentTypeList[contentTypeIndex].id, 0, 0).then(response => {
        this.contentList = response.fields_value;
        this.selectedContent = null;
        observer.next(true);
      });
    });
  }

  parseContentTitle(json: string) {
    return JSON.parse(json);
  }
}
