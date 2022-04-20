import { Component, OnInit } from '@angular/core';
import {SubheaderService} from "../../LayoutsComponents/subheader/_services/subheader.service";
import {TranslationService} from "../../../services/translation.service";
import {Observable} from "rxjs";
import {ActivityLogService} from "../../../services/activity-log.service";

@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.scss']
})
export class ActivityLogComponent implements OnInit {

  isLoading$: Observable<boolean>;

  logList: any[];

  pagination_string: string = "";
  currentPage = 1;
  itemsPerPage = 2;
  pagesCount = 0;
  totalRecords = 0;

  constructor(private subheader: SubheaderService, private translationService: TranslationService, private activityLogService: ActivityLogService) { }

  ngOnInit(): void {

    setTimeout(() => {
      this.subheader.setTitle('PAGE.ACTIVITY_LOG.TITLE');
      this.subheader.setBreadcrumbs([{
        title: 'PAGE.ACTIVITY_LOG.TITLE',
        linkText: 'PAGE.ACTIVITY_LOG.TITLE',
        linkPath: '/activity-log'
      }]);
    }, 1);

    this.loadLogPage();

  }

  /**
   *
   */
  loadLogPage() {
    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      this.activityLogService.getAdminActivityLogList(this.itemsPerPage, (this.currentPage - 1) * this.itemsPerPage).then(response => {
        if (!response.is_error) {
          this.logList = response.logList;
          this.totalRecords = response.totalRecords;
          this.pagesCount = Math.ceil(this.totalRecords / this.itemsPerPage);
          observer.next(false);
        }
      });
    });
  }

  /**
   * Show pagination string
   */
  paginationString() {
    this.pagination_string = this.translationService.translatePhrase("GENERAL.LANGUAGES.PAGINATION");
    this.pagination_string = this.pagination_string.replace("%total",this.pagesCount.toString());
    this.pagination_string = this.pagination_string.replace("%page",this.currentPage.toString());
    return this.pagination_string;
  }

  /**
   * Change page event.
   *
   * @param event page change event
   */
  pageChange(event: string) {
    this.currentPage = parseInt(event);
    this.loadLogPage();
  }


}
