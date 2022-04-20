import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {SubheaderService} from "../../LayoutsComponents/subheader/_services/subheader.service";
import {ToastService} from "../../framework/core/services/toast.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TranslationService} from "../../../services/translation.service";
import {BuildService} from "../../../services/build.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-build-queue',
  templateUrl: './build-queue.component.html',
  styleUrls: ['./build-queue.component.scss']
})
export class BuildQueueComponent implements OnInit {
  platform_url = environment.apiUrl;
  isLoading$: Observable<boolean>;

  records: any[] = [];
  totalRecords = 0;

  //filterString: string;
  //filterChange$: Observable<any>;

  pagination_string: string = "";
  currentPage = 1;
  itemsPerPage = 100;
  pagesCount = 0;

  orderField = 'id';
  orderDirection = 2;
  formGroup: FormGroup;

  is_loaded: boolean = false;

  constructor(private formBuilder: FormBuilder, private buildService: BuildService, private subheader: SubheaderService, private toastService: ToastService,  private translationService: TranslationService) { }

  ngOnInit(): void {

    setTimeout(() => {
      this.subheader.setTitle('PAGE.BUILD_QUEUE.TITLE');
      this.subheader.setBreadcrumbs([{
        title: 'PAGE.BUILD_QUEUE.TITLE',
        linkText: 'PAGE.BUILD_QUEUE.TITLE',
        linkPath: '/build-queue'
      }]);
    }, 1);

    this.isLoading$ = new Observable<boolean>( observer => {
      observer.next(true);
      this.loadData(observer);
    });
  }

  initFormGroup() {
    this.formGroup = null;
    let config = {
      checkbox_main: [false],
    };

    for (let i = 0; i < this.records.length; i++) {
      config['checkbox_' + this.records[i].id] = [false]
    }

    this.formGroup = this.formBuilder.group(config);
  }

  loadData(observer) {
      this.buildService.loadBuildQueueList((this.currentPage - 1), this.itemsPerPage, this.orderField, this.orderDirection === 1 ? 'ASC' : 'DESC').then(response => {
        
        this.records = response.list;
        this.records= [];
        response.list.forEach(element => {
          let item = element;
          item.user_name = element.user_name.toString();
          this.records.push(item);
        });
        this.totalRecords = response.totalRecords;
        this.pagesCount = Math.ceil(this.totalRecords / this.itemsPerPage);

        this.initFormGroup();
        this.is_loaded = true;
        observer.next(false);
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

    this.isLoading$ = new Observable<boolean>( observer => {
      observer.next(true);
      this.loadData(observer);
    });

  }

  /**
   * Change number items in page event.
   *
   * @param itemsPerPage
   */
  itemsPerPageChange(itemsPerPage: number) {
    this.currentPage = 1;
    this.itemsPerPage = itemsPerPage;

    this.isLoading$ = new Observable<boolean>( observer => {
      observer.next(true);
      this.loadData(observer);
    });

  }

  /**
   * Choose sort field.
   *
   * @param field
   */
  changeSort(field: any) {
    if (this.orderField && this.orderField == field && this.orderDirection !== 2) {
      this.orderDirection = 2;
    } else {
      this.orderDirection = 1;
    }
    this.orderField = field;

    this.isLoading$ = new Observable<boolean>( observer => {
      observer.next(true);
      this.loadData(observer);
    });
  }

  deleteRecord(id) {
    this.isLoading$ = new Observable<boolean>( observer => {
      observer.next(true);
      this.buildService.deleteBuildQueue([id]).then(response => {
        if (response.is_error) {
          this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_NOT_SAVED'), 'danger');
        } else {
          this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_SAVED'), 'success');

          this.loadData(observer);
        }
      });
    });
  }

  deleteChecked() {
    let checked_arr = [];
    for (let i  = 0; i < this.records.length; i++) {
      if (this.formGroup.controls['checkbox_'+this.records[i].id].value) {
        checked_arr.push(this.records[i].id);
      }
    }

    this.isLoading$ = new Observable<boolean>( observer => {
      observer.next(true);
      this.buildService.deleteBuildQueue(checked_arr).then(response => {
        if (response.is_error) {
          this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_NOT_SAVED'), 'danger');
        } else {
          this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_SAVED'), 'success');

          this.loadData(observer);

        }
      });
    });
  }

  changeAll() {
    let checked = this.formGroup.value['checkbox_main'];
    for (let i  = 0; i < this.records.length; i++) {
      this.formGroup.controls['checkbox_'+this.records[i].id].setValue(checked);
    }
  }
}
