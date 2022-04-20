import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TranslationService} from "../../../services/translation.service";
import {SubheaderService} from "../../ConstructorComponents/subheader/_services/subheader.service";
import {ToastService} from "../../../platform/framework/core/services/toast.service";
import {FormBuilder} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ApplicationService} from "../../../services/application.service";
import {fromEvent, Observable, Subject, Subscription} from "rxjs";
import {environment} from "../../../../environments/environment";
import {debounceTime} from "rxjs/operators";
import {KeyValue} from "@angular/common";

@Component({
  selector: 'app-content-list',
  templateUrl: './content-list.component.html',
  styleUrls: ['./content-list.component.scss']
})
export class ContentListComponent implements OnInit, OnDestroy {

  @ViewChild('userSearchInput', { static: true }) userSearchInput: ElementRef;

  applicationId: number;
  contentTypeId: number;

  resources_dir = '';
  platform_url = '';

  subscriptions: Subscription[] = [];
  isLoading$ = new Subject<boolean>();
  isPageLoad = false;

  fields: any[] = [];
  contents: any[] = [];
  languages: any = [];
  defaultLanguage = '';
  total = 0;

  filterString: string = '';
  filterChange$: Observable<any>;

  pagination_string: string = "";
  currentPage = 1;
  itemsPerPage = 10;
  pagesCount = 0;

  orderField: any;
  orderDirection = 0;

  deleteContentConfirm: any;

  constructor(private translationService: TranslationService, private subheader: SubheaderService, private toastService: ToastService, private router: Router, private applicationService: ApplicationService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.applicationId = Number(this.router.url.match(/constructor\/(\d+)/)[1]);
    this.platform_url = environment.apiUrl;


    this.route.params.subscribe(params => {
      this.contentTypeId = Number(params.content_type);

      setTimeout(() => {
        this.subheader.setTitle('CONSTRUCTOR.CONTENT_LIST.TITLE');
        this.subheader.setBreadcrumbs([{
          title: 'CONSTRUCTOR.CONTENT_LIST.TITLE',
          linkText: 'CONSTRUCTOR.CONTENT_LIST.TITLE',
          linkPath: '/constructor/' + this.applicationId + '/content/content-list/' + this.contentTypeId
        }]);
      }, 1);

      setTimeout(() => this.loadContentList(), 0);

      this.isLoading$.next(true);
      this.applicationService.getApplicationById(this.applicationId).then(response => {
        if (!response.is_error) {
          this.resources_dir = 'storage/application/' + response.id + "-" + response.unique_string_id + '/resources/';
          console.log("resources_dir "+this.resources_dir);
        }
        this.isLoading$.next(false);
      });
    });

    this.filterChange$ = fromEvent(this.userSearchInput.nativeElement, 'keyup')
        .pipe(
            debounceTime(300)
        );

    const sub = this.filterChange$.subscribe(() => {
      this.filterUsers();
    });
    this.subscriptions.push(sub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  /**
   * Load users to current page.
   */
  loadContentList() {
    this.isPageLoad = false;
    this.isLoading$.next(true);

    let direction = '';
    if (this.orderDirection === 1) {
      direction = 'asc';
    } else if (this.orderDirection === 2) {
      direction = 'desc';
    }
    this.applicationService.getApplicationContentList(this.applicationId, this.contentTypeId, this.itemsPerPage, (this.currentPage - 1) * this.itemsPerPage, this.filterString, this.orderField ? this.orderField.db_field : '', direction).then(response => {
      this.fields = response.fields;
      this.contents = response.fields_value;
      this.languages = response.languages;
      this.defaultLanguage = response.default_language;
      this.total = response.total;

      if (response.fields_value) {
        for (let i = 0; i < response.fields_value.length; i++) {
          Object.entries(response.fields_value[i]).forEach(([key, value]) => {
            if (key.startsWith('column_text') || key.startsWith('column_title') || key.startsWith('column_string')) {
              this.contents[i][key] = JSON.parse(<string>value);
            }
          });
        }
      }

      this.pagesCount = Math.ceil(this.total / this.itemsPerPage);
    }).catch(err => {
      console.log(err);
    }).finally(() => {
      this.isPageLoad = true;
      this.isLoading$.next(false);
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
    this.loadContentList();
  }

  /**
   * Change number items in page event.
   *
   * @param itemsPerPage
   */
  itemsPerPageChange(itemsPerPage: number) {
    this.currentPage = 1;
    this.itemsPerPage = itemsPerPage;
    this.loadContentList();
  }

  /**
   * Filters users by filter string, compares with user name and email.
   */
  filterUsers() {
    this.currentPage = 1;
    this.loadContentList();
  }

  /**
   * Delete content.
   *
   * @param contentId content id
   */
  deleteContent(contentId: any,) {
    this.isLoading$.next(true);

    this.applicationService.deleteApplicationContent(this.applicationId, contentId).then(response => {
      if (response.is_error) {
        this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_NOT_SAVED'), 'danger');
      } else {
        this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_SAVED'), 'success');

        this.loadContentList();
      }
    })
  }

  /**
   * Choose sort field.
   *
   * @param field
   * @param i
   */
  changeSort(field: any, i: number) {
      if (this.orderField && this.orderField.db_field == field.db_field && this.orderDirection !== 2) {
        this.orderDirection = 2;
      } else {
        this.orderDirection = 1;
      }
      this.orderField = field;
      this.loadContentList();
  }
}
