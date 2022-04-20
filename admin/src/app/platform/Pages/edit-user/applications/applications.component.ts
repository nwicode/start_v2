import {Component, OnInit, TemplateRef} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Observable} from 'rxjs';
import {UserService} from '../../../../services/user.service';
import {TranslationService} from "../../../../services/translation.service";
import {ToastService} from '../../../framework/core/services/toast.service';
import {SubheaderService} from '../../../LayoutsComponents/subheader/_services/subheader.service';
import {Router} from "@angular/router";
import {environment} from "../../../../../environments/environment";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ApplicationService} from "../../../../services/application.service";

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent implements OnInit {

  isLoading$: Observable<boolean>;
  userId: number;
  editUser: any;
  userApplications = [];

  constructor(private subheader: SubheaderService, private toastService: ToastService, private userService: UserService, private fb: FormBuilder, private translationService: TranslationService, private router: Router, private modalService: NgbModal, private applicationService: ApplicationService) {
  }

  ngOnInit(): void {
    this.userId = Number(this.router.url.match(/edit-user\/(\d+)/)[1]);

    setTimeout(() => {
      this.subheader.setTitle('EDIT.USER.APPLICATIONS');
      this.subheader.setBreadcrumbs([{
        title: 'EDIT.USER.TITLE',
        linkText: 'EDIT.USER.TITLE',
        linkPath: '/edit-user/' + this.userId
      }]);
    }, 1);

    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      this.userService.getUserInformationById(this.userId).then(user => {
        this.editUser = user;
        this.userApplications = this.editUser.applications;
        for (let i = 0; i < this.userApplications.length; i++) {
          this.userApplications[i].icon = environment.apiUrl + this.userApplications[i].icon;
        }

        observer.next(false);
      });
    });
  }

  /**
   * Disabled application.
   *
   * @param appId application id
   * @param content modal window
   */
  applicationDisabled(appId, content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      if (result === 'confirm') {
        this.isLoading$ = new Observable<boolean>(observer => {
          observer.next(true);

          this.applicationService.changeDisabledApplication(appId, 1).then(response => {
              if (response.is_error) {
                this.toastService.showsToastBar(this.translationService.translatePhrase('EDIT.USER.ERROR_REQUEST_TOAST'), 'danger');
              } else {
                  for (let i = 0; i < this.userApplications.length; i++) {
                    if (this.userApplications[i].id == appId) {
                      this.userApplications[i].disabled = 1;
                      break;
                    }
                  }
                this.toastService.showsToastBar(this.translationService.translatePhrase('EDIT.USER.APPLICATION_BLOCKED_TOAST'), 'success');
              }
              observer.next(false);
            });
        });
      }
    });
  }

  /**
   * Activated application.
   *
   * @param appId application id
   * @param templateRef modal window template
   */
  applicationActivated(appId, templateRef: TemplateRef<any>) {
    this.modalService.open(templateRef, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      if (result === 'confirm') {
        this.isLoading$ = new Observable<boolean>(observer => {
          observer.next(true);

          this.applicationService.changeDisabledApplication(appId, 0).then(response => {
            if (response.is_error) {
              this.toastService.showsToastBar(this.translationService.translatePhrase('EDIT.USER.ERROR_REQUEST_TOAST'), 'danger');
            } else {
              for (let i = 0; i < this.userApplications.length; i++) {
                if (this.userApplications[i].id == appId) {
                  this.userApplications[i].disabled = 0;
                  break;
                }
              }
              this.toastService.showsToastBar(this.translationService.translatePhrase('EDIT.USER.APPLICATION_ACTIVATED_TOAST'), 'success');
              this.userService.getUserInformationById(this.userId);
            }
            observer.next(false);
          });
        });
      }
    });
  }

  /**
   * Delete application.
   *
   * @param appId application id
   * @param templateRef modal window template
   */
  deleteApplication(appId, templateRef: TemplateRef<any>) {
    this.modalService.open(templateRef, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      if (result === 'confirm') {
        this.isLoading$ = new Observable<boolean>(observer => {
          observer.next(true);

          this.applicationService.deleteApplication(appId).then(response => {
            if (response.is_error) {
              this.toastService.showsToastBar(this.translationService.translatePhrase('EDIT.USER.ERROR_REQUEST_TOAST'), 'danger');
            } else {
              for (let i = 0; i < this.userApplications.length; i++) {
                if (this.userApplications[i].id == appId) {
                  this.userApplications.splice(i, 1);
                  break;
                }
              }
              this.toastService.showsToastBar(this.translationService.translatePhrase('EDIT.USER.APPLICATION_DELETED_TOAST'), 'success');
            }
            observer.next(false);
          });
        });
      }
    });
  }
}
