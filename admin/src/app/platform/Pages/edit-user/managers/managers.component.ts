import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {UserService} from "../../../../services/user.service";
import {Observable} from "rxjs";
import {SubheaderService} from "../../../LayoutsComponents/subheader/_services/subheader.service";
import {Router} from "@angular/router";
import {environment} from "../../../../../environments/environment";
import {ToastService} from "../../../framework/core/services/toast.service";
import {TranslationService} from "../../../../services/translation.service";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ModalPredefinedAvatarsComponent} from "../../../LayoutsComponents/modal-predefined-avatars/modal-predefined-avatars.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ConfirmPasswordValidator} from "../../../../modules/auth";

@Component({
  selector: 'app-managers',
  templateUrl: './managers.component.html',
  styleUrls: ['./managers.component.scss']
})
export class ManagersComponent implements OnInit {

  isLoading$: Observable<boolean>;
  userId: number;

  applications: any[] = [];
  managers: any[];
  deleteManagerConfirm: any;
  isShowManagerForm: boolean = false;
  managerForm: FormGroup;
  managerCurrentAvatar: string = '';
  managerAvatarUpdated: boolean = false;

  constructor(private subheader: SubheaderService, private userService: UserService, private router: Router, private toastService: ToastService, private translationService: TranslationService, private modalService: NgbModal, private changeDetectorRef: ChangeDetectorRef, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.userId = Number(this.router.url.match(/edit-user\/(\d+)/)[1]);

    setTimeout(() => {
      this.subheader.setTitle('EDIT.USER.MANAGERS');
      this.subheader.setBreadcrumbs([{
        title: 'EDIT.USER.TITLE',
        linkText: 'EDIT.USER.TITLE',
        linkPath: '/edit-user/' + this.userId
      }]);
    }, 1);

    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);

      Promise.all([this.userService.getUserManagers(this.userId), this.userService.getUserInformationById(this.userId)]).then(response => {
        this.managers = response[0];

        for (let i = 0; i < this.managers.length; i++) {
          if (this.managers[i].avatar) {
            this.managers[i].avatar = environment.apiUrl + "storage/users/avatars/" + this.managers[i].avatar;
          }
        }

        this.applications = response[1].applications;

        observer.next(false);
      })
    });
  }

  /**
   * Delete manager.
   *
   * @param manager manager object
   */
  deleteManager(manager: any) {
    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);

      this.userService.deleteManager(manager.id).then(response => {
        if (response.is_error) {
          this.toastService.showsToastBar(this.translationService.translatePhrase('EDIT.USER.MANAGER_NOT_DELETED'), 'danger');
        } else {
          this.toastService.showsToastBar(this.translationService.translatePhrase('EDIT.USER.MANAGER_DELETED'), 'success');

          for (let i = 0; i < this.managers.length; i++) {
            if (this.managers[i].id == manager.id) {
              this.managers.splice(i, 1);
              break;
            }
          }
        }
        observer.next(false);
      });
    });

  }

  /**
   * Initialization the manager form.
   */
  initManagerForm() {
    this.managerForm = this.fb.group(
        {
          name: [
            '',
            Validators.compose([
              Validators.required,
              Validators.minLength(3),
              Validators.maxLength(100),
            ]),
          ],
          lastname: [
            '',
            Validators.compose([
              Validators.required,
              Validators.minLength(3),
              Validators.maxLength(100),
            ]),
          ],
          email: [
            '',
            Validators.compose([
              Validators.required,
              Validators.email,
              Validators.minLength(3),
              Validators.maxLength(320),
            ]),
          ],
          password: [
            '', Validators.compose([
              Validators.required,
              Validators.minLength(3),
              Validators.maxLength(100),
            ])
          ],
          password_confirmation: [
            '', Validators.compose([
              Validators.required,
              Validators.minLength(3),
              Validators.maxLength(100),
            ])
          ],
          associatedApplications: new FormArray([])
        },
        {
          validator: ConfirmPasswordValidator.MatchPassword,
        }
    );

    for (let i = 0; i < this.applications.length; i++) {
      let app = new FormControl(false);
      (<FormArray>this.managerForm.get('associatedApplications')).push(app);
    }
  }

  /**
   * Submit add manager form.
   */
  createManager() {
    if (this.managerForm.valid && this.managerCurrentAvatar) {
      this.isLoading$ = new Observable<boolean>(observer => {
        observer.next(true);
        this.managerForm.disable();
        let associatedApplications = [];
        for (let i = 0; i < this.applications.length; i++) {
          associatedApplications.push({
            appId: this.applications[i].id,
            isAssociated: this.managerForm.get('associatedApplications').value[i]
          });
        }

        this.userService.createManager(this.userId, this.managerCurrentAvatar, this.managerForm.get('name').value, this.managerForm.get('lastname').value, this.managerForm.get('email').value, this.managerForm.get('password').value, associatedApplications).then(response => {
          if (response.is_error) {
            if (response.error.error === 'USER_WITH_THIS_EMAIL_ALREADY_EXIST') {
              this.toastService.showsToastBar(this.translationService.translatePhrase('ERROR.MESSAGES.EMAIL_ALREADY_EXISTS'), 'danger');
            } else {
              this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_NOT_SAVED'), 'danger');
            }
          } else {
            this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_SAVED'), 'success');

            let newManager = response;
            if (newManager.avatar) {
              newManager.avatar = environment.apiUrl + "storage/users/avatars/" + newManager.avatar;
            }
            this.managers.push(newManager);

            this.isShowManagerForm = false;
          }

          this.managerForm.enable();
          observer.next(false);
        });

      });
    }
  }

  /**
   * Translate phrase.
   *
   * @param phrase
   */
  public translate(phrase: string) {
    let result = this.translationService.translatePhrase(phrase);
    return result;
  }

  /**
   * Open modal window with predefined avatars.
   */
  showPredefinedAvatars() {
    const modalRef = this.modalService.open(ModalPredefinedAvatarsComponent, {
      size: 'lg',
      scrollable: true
    });

    let pathPredefinedAvatars = [
      './assets/images/predefined_avatars/avatar-nw.png'
    ];

    for (let i = 1; i <= 11; i++) {
      pathPredefinedAvatars.push('./assets/images/predefined_avatars/avatar-nw (' + i + ').png');
    }

    modalRef.componentInstance.content = pathPredefinedAvatars;
    modalRef.componentInstance.header = 'EDIT.USER.MANAGER_FORM.PREDEFINED_AVATAR';

    modalRef.result.then(result => {
      if (result) {
        this.managerAvatarUpdated = true;
        this.managerCurrentAvatar = result;

        this.changeDetectorRef.detectChanges();
      }
    });
  }

  /**
   * Manager avatar change event.
   *
   * @param event
   */
  handleManagerAvatarChange(event: any) {
    this.managerAvatarUpdated = true;
    this.managerCurrentAvatar = event;
  }

  /**
   * Manager avatar reset event.
   *
   * @param event
   */
  handleManagerAvatarReset(event: any) {
    this.managerCurrentAvatar = '';
    this.managerAvatarUpdated = false;
  }

  /**
   * Show manager form.
   */
  showManagerForm() {
    this.managerCurrentAvatar = '';
    this.managerAvatarUpdated = false;

    this.initManagerForm();
    this.isShowManagerForm = true;
  }
}
