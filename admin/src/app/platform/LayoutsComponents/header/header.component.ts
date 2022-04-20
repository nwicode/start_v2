import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import {
  Router,
  NavigationStart,
  RouteConfigLoadStart,
  RouteConfigLoadEnd,
  NavigationEnd,
  NavigationCancel,
} from '@angular/router';
import { LayoutService } from '../../../platform/framework/core';
import KTLayoutHeader from '../../../../assets/js/layout/base/header';
import KTLayoutHeaderMenu from '../../../../assets/js/layout/base/header-menu';
import { KTUtil } from '../../../../assets/js/components/util';
import { Subscription, Observable, BehaviorSubject } from 'rxjs';

import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { ApplicationService } from '../../../services/application.service';
import {environment} from '../../../../environments/environment';
import {ConfigService} from '../../../services/config.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  headerContainerCSSClasses: string;
  headerMenuSelfDisplay: boolean;
  headerMenuSelfStatic: boolean;
  isConstructorArea: boolean = false;
  asideSelfDisplay: boolean;
  headerLogo: string;
  headerSelfTheme: string;
  headerMenuCSSClasses: string;
  applicationsListMenuToggle: string;
  headerMenuHTMLAttributes: any = {};
  routerLoaderTimout: any;

  applications_list:any[] = [];

  @ViewChild('ktHeaderMenu', { static: true }) ktHeaderMenu: ElementRef;
  loader$: Observable<number>;

  private loaderSubject: BehaviorSubject<number> = new BehaviorSubject<number>(
    0
  );
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  config: any;

  constructor(private appService: ApplicationService, private configService: ConfigService, private userService:UserService, private layout: LayoutService, private router: Router, private route: ActivatedRoute,) {
    this.loader$ = this.loaderSubject;

    
    // page progress bar percentage
    const routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // set page progress bar loading to start on NavigationStart event router
        this.loaderSubject.next(10);
      }
      if (event instanceof RouteConfigLoadStart) {
        this.loaderSubject.next(65);
      }
      if (event instanceof RouteConfigLoadEnd) {
        this.loaderSubject.next(90);
      }
      if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        // set page progress bar loading to end on NavigationEnd event router
        this.loaderSubject.next(100);
        if (this.routerLoaderTimout) {
          clearTimeout(this.routerLoaderTimout);
        }
        this.routerLoaderTimout = setTimeout(() => {
          this.loaderSubject.next(0);
        }, 300);
      }
    });
    this.unsubscribe.push(routerSubscription);
  }

  async ngOnInit(): Promise<void> {

    this.config = await this.configService.getConfig();

    if (this.router.url.includes("/constructor")) this.isConstructorArea = true; else this.isConstructorArea = false;

    //Menu with applications
    //if customer or manager
    this.applications_list = [];
    this.userService.check_me().then( user_result=>{

      if (user_result.user_type_id==1 || user_result.user_type_id==2) {
        this.appService.loadUserApplications().then(app_list=>{
          
          if (app_list.length>0) {
            app_list.forEach(element => {
              this.applications_list.push({
                name: element.name,
                id: element.id,
                description: element.description,
                icon: environment.apiUrl + 'storage/application/'+element.id+'-'+element.unique_string_id+'/resources/icon_100x100.png'
              });
            });
          }
        });
      } else if (user_result.user_type_id==3){
        this.userService.getManager().then(manager => {
          if (manager.associatedApplications.length>0) {
            manager.associatedApplications.forEach(element => {
              this.applications_list.push({
                name: element.name,
                id: element.id,
                description: element.description,
                icon: environment.apiUrl + 'storage/application/'+element.id+'-'+element.unique_string_id+'/resources/icon_100x100.png'
              });
            });
          }
        });
      }
    })


    this.headerContainerCSSClasses = this.layout.getStringCSSClasses(
      'header_container'
    );
    this.headerMenuSelfDisplay = this.layout.getProp(
      'header.menu.self.display'
    );
    this.headerMenuSelfStatic = this.layout.getProp('header.menu.self.static');
    this.asideSelfDisplay = this.layout.getProp('aside.self.display');
    this.headerSelfTheme = this.layout.getProp('header.self.theme') || '';
    this.headerLogo = this.getLogoURL();
    this.headerMenuCSSClasses = this.layout.getStringCSSClasses('header_menu');
    this.headerMenuHTMLAttributes = this.layout.getHTMLAttributes(
      'header_menu'
    );
    this.headerLogo = this.config.inner_logo;
  }

  private getLogoURL(): string {
    let result = 'logo-light.png';

    if (this.headerSelfTheme && this.headerSelfTheme === 'light') {
      result = 'logo-dark.png';
    }

    if (this.headerSelfTheme && this.headerSelfTheme === 'dark') {
      result = 'logo-dark.png';
    }

    return `./assets/media/logos/${result}`;
  }

  ngAfterViewInit(): void {
    if (this.ktHeaderMenu) {
      for (const key in this.headerMenuHTMLAttributes) {
        if (this.headerMenuHTMLAttributes.hasOwnProperty(key)) {
          this.ktHeaderMenu.nativeElement.attributes[
            key
          ] = this.headerMenuHTMLAttributes[key];
        }
      }
    }

    KTUtil.ready(() => {
      // Init Desktop & Mobile Headers
      KTLayoutHeader.init('kt_header', 'kt_header_mobile');
      // Init Header Menu
      KTLayoutHeaderMenu.init('kt_header_menu', 'kt_header_menu_wrapper');
    });
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
    if (this.routerLoaderTimout) {
      clearTimeout(this.routerLoaderTimout);
    }
  }
}
