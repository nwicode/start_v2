import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LayoutService, DynamicAsideMenuService } from '../../../../platform/framework/core';

import {ConstructorDynamicAsideMenuService} from "../services/constructor-dynamic-aside-menu.service";
import { LayoutService as LayoutService2 } from '../../../../services/layout.service';
import { ConfigService } from '../../../../services/config.service';

@Component({
  selector: 'app-constructor-aside-dynamic',
  templateUrl: './aside-dynamic.component.html',
  styleUrls: ['./aside-dynamic.component.scss']
})
export class AsideDynamicComponent implements OnInit, OnDestroy {
  isLoading = true;
  componentMenuState: string = "false";
  menuConfig: any;
  subscriptions: Subscription[] = [];

  disableAsideSelfDisplay: boolean;
  headerLogo: string;
  brandSkin: string;
  ulCSSClasses: string;
  asideMenuHTMLAttributes: any = {};
  asideMenuCSSClasses: string;
  asideMenuDropdown;
  brandClasses: string;
  asideMenuScroll = 1;
  asideSelfMinimizeToggle = false;

  currentUrl: string;

  show_plus: boolean = false;

  config: any;

  constructor(
    private layout: LayoutService,
    private layoutService: LayoutService2,
    private router: Router,
    private configService: ConfigService, 
    private menu: ConstructorDynamicAsideMenuService,
    private cdr: ChangeDetectorRef) {

      router.events.subscribe((val) => {
        // see also 
        if (val instanceof NavigationEnd) {
          this.switchPlusButton();
        }
    });      

  }

  switchPlusButton() {
    if (this.router.url.match(/constructor\/(\d+)\/layouts/)) {
      this.show_plus = true;
    } else {
      this.show_plus = false;
    }
  }

  async ngOnInit(): Promise<void> {

    this.config = await this.configService.getConfig();

    /*this.layoutService.onSideActionSubject().subscribe(data =>{
      if (data.event=="layouts_open") this.show_plus = true;
      if (data.event=="layouts_open") this.show_plus = false;
    })*/

    // load view settings
    this.disableAsideSelfDisplay =
      this.layout.getProp('aside.self.display') === false;
    this.brandSkin = this.layout.getProp('brand.self.theme');
    //this.headerLogo = this.getLogo();
    this.headerLogo = this.config.inner_logo;
    this.ulCSSClasses = this.layout.getProp('aside_menu_nav');
    this.asideMenuCSSClasses = this.layout.getStringCSSClasses('aside_menu');
    this.asideMenuHTMLAttributes = this.layout.getHTMLAttributes('aside_menu');
    this.asideMenuDropdown = this.layout.getProp('aside.menu.dropdown') ? '1' : '0';
    this.brandClasses = this.layout.getProp('brand');
    this.asideSelfMinimizeToggle = this.layout.getProp(
      'aside.self.minimize.toggle'
    );
    this.asideMenuScroll = this.layout.getProp('aside.menu.scroll') ? 1 : 0;
    // this.asideMenuCSSClasses = `${this.asideMenuCSSClasses} ${this.asideMenuScroll === 1 ? 'scroll my-4 ps ps--active-y' : ''}`;

    // router subscription
    this.currentUrl = this.router.url.split(/[?#]/)[0];
    const routerSubscr = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentUrl = event.url;
      this.cdr.detectChanges();
    });
    this.subscriptions.push(routerSubscr);

    // menu load
    const menuSubscr = this.menu.menuConfig$.subscribe(res => {
      this.menuConfig = res;
      this.cdr.detectChanges();
    });
    this.subscriptions.push(menuSubscr);

    const loadingSubscr = this.menu.isLoading$.subscribe((result) => {
      this.isLoading = result;
    });
    this.subscriptions.push(loadingSubscr);
  }

  private getLogo() {
    if (this.brandSkin === 'light') {
      return './assets/media/logos/logo-dark.png';
    } else {
      return './assets/media/logos/logo-light.png';
    }
  }

  isMenuItemActive(path) {
    if (!this.currentUrl || !path) {
      return false;
    }

    if (this.currentUrl === path) {
      return true;
    }

    if (this.currentUrl.indexOf(path) > -1) {
      return true;
    }

    return false;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }



  //Change component list panel state
  showSideComponent()  {
    this.layoutService.clickComponentPanelEvent();

  }   
}
