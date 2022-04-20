import {Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {fromEvent, Observable, Subject, Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {SubheaderService} from "../../LayoutsComponents/subheader/_services/subheader.service";
import {ToastService} from "../../framework/core/services/toast.service";
import {environment} from "../../../../environments/environment";
import {ApplicationService} from "../../../services/application.service";
import {TranslationService} from "../../../services/translation.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {debounceTime} from "rxjs/operators";

@Component({
  selector: 'app-application-list',
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.scss']
})
export class ApplicationListComponent implements OnInit, OnDestroy {

  @ViewChild('applicationSearchInput', { static: true }) userSearchInput: ElementRef;

  subscriptions: Subscription[] = [];
  isLoading$ = new Subject<boolean>();
  isPageLoad = false;

  applications: any[] = [];
  totalApplications = 0;

  filterString: string;
  filterChange$: Observable<any>;

  pagination_string: string = "";
  currentPage = 1;
  itemsPerPage = 10;
  pagesCount = 0;

  constructor(private applicationService: ApplicationService, private route: ActivatedRoute,  private subheader: SubheaderService,
              private toastService: ToastService, private modalService: NgbModal, private translationService: TranslationService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.subheader.setTitle('PAGE.APPLICATIONS_LIST.APPLICATIONS_LIST');
      this.subheader.setBreadcrumbs([{
        title: 'PAGE.APPLICATIONS_LIST.TITLE',
        linkText: 'PAGE.APPLICATIONS_LIST.TITLE',
        linkPath: '/apps'
      }]);
    }, 1);

    setTimeout(() => this.loadApplications(), 0);

  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  /**
   * Load applications to current page.
   */
  loadApplications() {
    this.isPageLoad = false;
    this.isLoading$.next(true);

    this.applicationService.getApplications(1, 0, '', '', '').then(result => {
      this.applications = result.applications;
      if (this.applications.length>0) location.href = "/constructor/1";
    }).catch(err => {
      console.log(err);
    }).finally(() => {
      this.isPageLoad = true;
      this.isLoading$.next(false);
    });
  }

}
