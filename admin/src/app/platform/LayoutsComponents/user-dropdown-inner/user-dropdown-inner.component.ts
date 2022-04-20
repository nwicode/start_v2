import { Component, OnInit } from '@angular/core';

import { LayoutService } from '../../../platform/framework/core';
import {UserService} from '../../../services/user.service';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';


@Component({
  selector: 'app-user-dropdown-inner',
  templateUrl: './user-dropdown-inner.component.html',
  styleUrls: ['./user-dropdown-inner.component.scss'],
})
export class UserDropdownInnerComponent implements OnInit {
  extrasUserDropdownStyle: 'light' | 'dark' = 'light';

  //user get data subscription
  userUpdateSubscription: Subscription;
  userLoaded: boolean = false;
  userCurrent: any;

  currentUrl = "";

  @Output() onClick = new EventEmitter<string>();

  constructor(private layout: LayoutService, private userService: UserService, private router: Router, private location: Location) {
    this.userUpdateSubscription = this.userService.onUserUpate().subscribe(data => {
      this.userLoaded = true;
      this.userCurrent = data.result;
    });

    this.userService.current().then((response) => {
      if (response.user_type_id !== 1) {
        if (!location.path().startsWith('/user-page')) {
          this.currentUrl = this.location.path();
        }
      }
    });

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) this.onClick.emit(event.url);
      if (event instanceof NavigationEnd) {
        if (!event.url.startsWith('/user-page') && this.userCurrent && this.userCurrent.user_type_id !== 1) {
          this.currentUrl = this.location.path();
        }
      }
    });

    
  }

  async ngOnInit(): Promise<void> {
    this.extrasUserDropdownStyle = this.layout.getProp(
      'extras.user.dropdown.style'
    );
  }

  logout() {
    //
    this.userService.do_signout()
  }


  async refreshUser() {
    //this.currentUser = await this.user.current();
  }
}
