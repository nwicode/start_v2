import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {TranslationService} from "../../services/translation.service";
import {SubheaderService} from "../ConstructorComponents/subheader/_services/subheader.service";
import {ToastService} from "../../platform/framework/core/services/toast.service";
import {Router} from "@angular/router";
import {ApplicationService} from "../../services/application.service";
import {ConstructorDynamicAsideMenuService} from "../ConstructorComponents/aside-menu/services/constructor-dynamic-aside-menu.service";

@Component({
  selector: 'app-content-type-list',
  templateUrl: './content-type-list.component.html',
  styleUrls: ['./content-type-list.component.scss']
})
export class ContentTypeListComponent implements OnInit {

  isLoading$: Observable<boolean>;
  applicationId;

  contentTypes: any[];
  selectedContentTypeIndex = -1;

  constructor(private translationService: TranslationService, private subheader: SubheaderService, private toastService: ToastService, private router: Router, private applicationService: ApplicationService, private changeDetectorRef: ChangeDetectorRef, private constructorDynamicAsideMenuService: ConstructorDynamicAsideMenuService) { }

  ngOnInit(): void {

    this.applicationId = Number(this.router.url.match(/constructor\/(\d+)/)[1]);

    setTimeout(() => {
      this.subheader.setTitle('CONSTRUCTOR.CONTENT_TYPE_LIST.TITLE');
      this.subheader.setBreadcrumbs([{
        title: 'CONSTRUCTOR.CONTENT_TYPE_LIST.TITLE',
        linkText: 'CONSTRUCTOR.CONTENT_TYPE_LIST.TITLE',
        linkPath: '/constructor/' + this.applicationId + '/content-type-list'
      }]);
    }, 1);

    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      this.applicationService.getApplicationContentTypesList(this.applicationId).then(response => {
        if (!response.is_error) {
          this.contentTypes = response.content_types;
          observer.next(false);
        }
      });
    });

  }

  /**
   * Click event on confirm button.
   *
   * @param i index in array
   */
  clickContentTypeConfirm(i: number) {
    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      this.applicationService.deleteApplicationContentType(this.applicationId, this.contentTypes[i].id).then(response => {
        if (response.is_error) {
          this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_NOT_SAVED'), 'danger');
        } else {
          this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_SAVED'), 'success');
          this.selectedContentTypeIndex = -1;
          this.constructorDynamicAsideMenuService.getSideMenu();
          this.applicationService.getApplicationContentTypesList(this.applicationId).then(response => {
            if (!response.is_error) {
              this.contentTypes = response.content_types;
              observer.next(false);
            }
          });
        }
      });
    });
  }

  /**
   * Click event on cancel button.
   *
   * @param i index in array
   */
  clickContentTypeCancel(i: number) {
    this.selectedContentTypeIndex = -1;
    this.changeDetectorRef.detectChanges();
  }

  /**
   * Click event on delete button.
   *
   * @param i index in array
   */
  chooseContentType(i: number) {
    this.selectedContentTypeIndex = i;
    this.changeDetectorRef.detectChanges();
  }
}
