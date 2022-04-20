import { Component, OnInit, AfterViewInit,OnDestroy, Input, ViewChild, ElementRef  } from '@angular/core';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import { LayoutService } from '../../../platform/framework/core';
import KTLayoutQuickSearch from '../../../../assets/js/layout/extended/quick-search';
import KTLayoutQuickNotifications from '../../../../assets/js/layout/extended/quick-notifications';
import KTLayoutQuickActions from '../../../../assets/js/layout/extended/quick-actions';
import KTLayoutQuickCartPanel from '../../../../assets/js/layout/extended/quick-cart';
import KTLayoutQuickPanel from '../../../../assets/js/layout/extended/quick-panel';
import KTLayoutQuickUser from '../../../../assets/js/layout/extended/quick-user';
import KTLayoutHeaderTopbar from '../../../../assets/js/layout/base/header-topbar';
import { KTUtil } from '../../../../assets/js/components/util';
import {UserService} from '../../../services/user.service';
import {ChangeDetectorRef} from '@angular/core'
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../environments/environment';
import {NotificationsService} from '../../../services/notifications.service';


@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit, AfterViewInit, OnDestroy  {


  @ViewChild('profileDropDown', { static: false }) profileDropDown: NgbDropdown;

  //user get data subscription
  userUpdateSubscription: Subscription;
  userLoaded: boolean = false;
  userCurrent: any = {
    short_name: "",
    letter: "",
    name: "",
  };
 //Notify get data subscription
  updateNewNotifications: Subscription;
  is_newNotifications:boolean;

  // tobbar extras
  extraSearchDisplay: boolean;
  extrasSearchLayout: 'offcanvas' | 'dropdown';
  extrasNotificationsDisplay: boolean;
  extrasNotificationsLayout: 'offcanvas' | 'dropdown';
  extrasQuickActionsDisplay: boolean;
  extrasQuickActionsLayout: 'offcanvas' | 'dropdown';
  extrasCartDisplay: boolean;
  extrasCartLayout: 'offcanvas' | 'dropdown';
  extrasQuickPanelDisplay: boolean;
  extrasLanguagesDisplay: boolean;
  extrasUserDisplay: boolean;
  extrasUserLayout: 'offcanvas' | 'dropdown';
  avatar: string ="";

  constructor(private layout: LayoutService, private userService: UserService, private ref: ChangeDetectorRef, private notificationsService: NotificationsService) {
    this.userUpdateSubscription = this.userService.onUserUpate().subscribe(data => {
      this.userCurrent = data.result;
      this.userLoaded = true;
      this.avatar = this.userCurrent.avatar;
      if (!this.avatar) {
        this.avatar = "";
      } else {
        this.avatar = environment.apiUrl + "storage/users/avatars/" + this.avatar;
      }      
      this.ref.detectChanges();
    });    
    this.userService.current().then ( ()=>{
      this.userLoaded = true;
    });

    this.updateNewNotifications = this.notificationsService.getNotifications().subscribe(data => {
        if(data.result.NEW.length >= 0) {
          this.is_newNotifications = true;
        }else{
          this.is_newNotifications = false;
        }
    });

  }

  ngOnInit(): void {
    // topbar extras
    this.extraSearchDisplay = this.layout.getProp('extras.search.display');
    this.extrasSearchLayout = this.layout.getProp('extras.search.layout');
    this.extrasNotificationsDisplay = this.layout.getProp(
      'extras.notifications.display'
    );
    this.extrasNotificationsLayout = this.layout.getProp(
      'extras.notifications.layout'
    );
    this.extrasQuickActionsDisplay = this.layout.getProp(
      'extras.quickActions.display'
    );
    this.extrasQuickActionsLayout = this.layout.getProp(
      'extras.quickActions.layout'
    );
    this.extrasCartDisplay = this.layout.getProp('extras.cart.display');
    this.extrasCartLayout = this.layout.getProp('extras.cart.layout');
    this.extrasLanguagesDisplay = this.layout.getProp(
      'extras.languages.display'
    );
    this.extrasUserDisplay = this.layout.getProp('extras.user.display');
    this.extrasUserLayout = this.layout.getProp('extras.user.layout');
    this.extrasQuickPanelDisplay = this.layout.getProp(
      'extras.quickPanel.display'
    );
    
  }

  ngAfterViewInit(): void {
    KTUtil.ready(() => {
      // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
      // Add 'implements AfterViewInit' to the class.
      if (this.extraSearchDisplay && this.extrasSearchLayout === 'offcanvas') {
        KTLayoutQuickSearch.init('kt_quick_search');
      }

      if (
        this.extrasNotificationsDisplay &&
        this.extrasNotificationsLayout === 'offcanvas'
      ) {
        // Init Quick Notifications Offcanvas Panel
        KTLayoutQuickNotifications.init('kt_quick_notifications');
      }

      if (
        this.extrasQuickActionsDisplay &&
        this.extrasQuickActionsLayout === 'offcanvas'
      ) {
        // Init Quick Actions Offcanvas Panel
        KTLayoutQuickActions.init('kt_quick_actions');
      }

      if (this.extrasCartDisplay && this.extrasCartLayout === 'offcanvas') {
        // Init Quick Cart Panel
        KTLayoutQuickCartPanel.init('kt_quick_cart');
      }

      if (this.extrasQuickPanelDisplay) {
        // Init Quick Offcanvas Panel
        KTLayoutQuickPanel.init('kt_quick_panel');
      }

      if (this.extrasUserDisplay && this.extrasUserLayout === 'offcanvas') {
        // Init Quick User Panel
        KTLayoutQuickUser.init('kt_quick_user');
      }

      // Init Header Topbar For Mobile Mode
      KTLayoutHeaderTopbar.init('kt_header_mobile_topbar_toggle');
    });
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.userUpdateSubscription.unsubscribe();
    this.updateNewNotifications.unsubscribe();
}


  handleClick(event){
    //console.log("profile close event");
    //console.log(event);
    this.profileDropDown.close();

  }

}
