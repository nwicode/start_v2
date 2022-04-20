import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable, Subject, Subscription} from 'rxjs';
import {UserService} from '../../../../services/user.service';
import {TranslationService} from '../../../../services/translation.service';
import {ToastService} from '../../../framework/core/services/toast.service';
import {SubheaderService} from '../../../LayoutsComponents/subheader/_services/subheader.service';
import {RequestService} from '../../../../services/request.service';
import {environment} from '../../../../../environments/environment';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ModalPredefinedAvatarsComponent} from "../../../LayoutsComponents/modal-predefined-avatars/modal-predefined-avatars.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.scss']
})
export class PersonalInformationComponent implements OnInit, OnDestroy {
  croppedImage: any = './assets/media/users/blank.png';
  formGroup: FormGroup;
  user: any;
  firstUserState: any;
  subscriptions: Subscription[] = [];
  avatarPic = 'none';
  isLoading$: Observable<boolean>;
  countries: any[];
  currentAppLanguage: string;
  userId: number;

  avatar_updated: boolean = false;
  avatar_reset: boolean = false;
  avatar_base64: string = "";

  constructor(private request:RequestService, private subheader: SubheaderService, private fb: FormBuilder, private userService: UserService, private translationService: TranslationService,
    private toastService: ToastService, private modalService: NgbModal, private changeDetector: ChangeDetectorRef, private router: Router) {}

  ngOnInit(): void {
    this.userId = Number(this.router.url.match(/edit-user\/(\d+)/)[1]);

    setTimeout(() => {
      this.subheader.setTitle('EDIT.USER.PERSONAL_INFORMATION');
      this.subheader.setBreadcrumbs([{
        title: 'EDIT.USER.TITLE',
        linkText: 'EDIT.USER.TITLE',
        linkPath: '/edit-user/' + this.userId
      }]);
    }, 1);

    this.currentAppLanguage = this.translationService.getSelectedLanguage();
    this.user = {};
    this.countries = [10];
    this.loadForm();

    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      this.userService.getUserInformationById(this.userId).then(user => {
        this.user = Object.assign({}, user);
        this.firstUserState = Object.assign({}, user);
        this.countries = this.userService.getCountries();
        this.loadForm();
        observer.next(false);
      });
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  /**
   * Init formGroup.
   */
  loadForm() {
    if (!this.user.avatar) {
      this.croppedImage = "./assets/media/users/blank.png";
    } else {
      this.croppedImage = environment.apiUrl + "storage/users/avatars/" + this.user.avatar;
      this.user.avatar = environment.apiUrl + "storage/users/avatars/" + this.user.avatar;
    }
    this.formGroup = this.fb.group({
      avatar: [this.croppedImage, Validators.required],
      name: [this.user.name, Validators.required],
      lastname: [this.user.lastname, Validators.required],
      address: [this.user.address, Validators.required],
      country: [this.user.country, Validators.required],
      phone: [this.user.phone, Validators.required],
      company: [this.user.company]
    });
  }

  /**
   * Save changes.
   */
  save() {
    this.formGroup.markAllAsTouched();
    if (!this.formGroup.valid) {
      return;
    }

    this.formGroup.value['avatar'] = this.user.avatar;
    const formValues = this.formGroup.value;
    this.user = Object.assign(this.user, formValues);

    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      this.formGroup.disable();

      let avatar_to_save:string = "stay";
      if (this.avatar_reset) avatar_to_save = "deleted";
      else if (this.avatar_updated) avatar_to_save = this.avatar_base64;

      this.userService.editUserPersonalInformation(this.userId, formValues.name, formValues.lastname, formValues.phone,
          formValues.country, formValues.address, formValues.company, avatar_to_save).then(() => {
           observer.next(false);
           this.toastService.showsToastBar(this.translationService.translatePhrase('EDIT.USER.CHANGES_SAVED'), 'success');
           this.formGroup.enable();
           this.userService.getUserInformationById(this.userId).then(user => {
             this.firstUserState = user;
           });
      });
    });
  }

  /**
   * Remove changes.
   */
  cancel() {
    this.user = Object.assign({}, this.firstUserState);
    this.loadForm();
  }

  getPic() {
    if (!this.user.avatar) {
      return 'none';
    }

    return `url('${this.croppedImage}')`;
  }

  deletePic() {
    this.user.avatar = '';
  }

  // helpers for View
  isControlValid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  public async removeavatar() {
    /*let user = await this.userService.check_me();
    this.my_id = user.id
    let result:any;
    try {
      let data =  await this.request.makePostRequest('api/removeavatar',{id:this.my_id});
      console.log("result: ", data)
    } catch (error) {
      console.log("error: ", error)
    } 
    return result;    */
  }


  handleAvatarChange(event:any) {
    console.log("Avatar change");
    this.avatar_updated = true;
    this.avatar_reset = false;
    this.avatar_base64 = event;
    this.user.avatar = this.avatar_base64;
  }

  handleAvatarReset(event:any) {
    console.log("Avatar reset");

    this.deletePic();
    this.avatar_reset = true;
    this.avatar_updated = false;
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
    modalRef.componentInstance.header = 'EDIT.USER.PREDEFINED_AVATAR';

    modalRef.result.then(result => {
        if (result) {
          this.avatar_updated = true;
          this.avatar_base64 = result;
          this.user.avatar = result;

          this.changeDetector.detectChanges();
        }
    });
  }
}
