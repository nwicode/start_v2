import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {SubheaderService} from "../../LayoutsComponents/subheader/_services/subheader.service";
import {UserService} from "../../../services/user.service";
import {environment} from "../../../../environments/environment";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit, OnDestroy {

  editUser: any;
  avatar: any;
  userApplications = [];
  userManagers = [];
  subscriptions: Subscription[] = [];

  constructor(private subheader: SubheaderService, private userService: UserService, private ref: ChangeDetectorRef, private route: ActivatedRoute) {}


  ngOnInit(): void {
    this.route.params.subscribe(val => {
      let id = this.route.snapshot.paramMap.get('user_id');

      this.userService.getUserInformationById(id).then(response => {
        if (!response.is_error) {
          this.editUser = response;
          this.userApplications = this.editUser.applications;

          this.avatar = this.editUser.avatar
            if (!this.avatar) {
              this.avatar = "./assets/media/users/blank.png";
            } else {
              this.avatar = environment.apiUrl + "storage/users/avatars/" + this.avatar;
            }
            this.ref.detectChanges();
        }
      });

      this.userService.getUserManagers(id).then(managers => {
        this.userManagers = managers;

        this.ref.detectChanges();
      });
    });

    let userUpdateSubscription = this.userService.onEditUserUpdate().subscribe(data => {
      this.editUser = data.result;
      if (this.editUser.applications) {
        this.userApplications = this.editUser.applications;
      }
      this.avatar = this.editUser.avatar
      if (!this.avatar) {
        this.avatar = "./assets/media/users/blank.png";
      } else {
        this.avatar = environment.apiUrl + "storage/users/avatars/" + this.avatar;
      }

      this.ref.detectChanges();
    });
    this.subscriptions.push(userUpdateSubscription);

    let deleteManagerSubscription = this.userService.onChangeEditUserManagers().subscribe(() => {
      this.userService.getUserManagers(this.editUser.id).then(managers => {
        this.userManagers = managers;

        this.ref.detectChanges();
      });
    });
    this.subscriptions.push(deleteManagerSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

}
