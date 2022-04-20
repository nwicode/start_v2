import {
  Component,
  ChangeDetectionStrategy,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { TranslationService } from './services/translation.service';
import { SplashScreenService } from './platform/framework/partials/layout/splash-screen/splash-screen.service';
import { Router, NavigationEnd, NavigationError } from '@angular/router';
import { Subscription } from 'rxjs';
import { TableExtendedService } from './platform/framework/shared/crud-table';
import {LayoutService} from "./platform/framework/core";
import {UserService} from "./services/user.service";
import { Meta, Title } from '@angular/platform-browser';
import * as $ from 'jquery';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'body[root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  private currentUser;

  constructor(
    private translationService: TranslationService,
    private splashScreenService: SplashScreenService,
    private router: Router,
    private tableService: TableExtendedService,
    private layout: LayoutService,
    private user: UserService,
    private title: Title, private meta: Meta
  ) {

  }

  async ngOnInit() {

    // register translations
    await this.translationService.readLanguages();
    this.translationService.setInitialAppLanguage();

    //clear dark theme
    document.body.classList.remove('dark-theme');

    const userSubscription = this.user.onUserUpate().subscribe(response => {
      this.currentUser = response.result;
    });
    this.unsubscribe.push(userSubscription);

    const routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {

        // removing aside menu for customer and manager on some urls
        let withoutAsideUrl = [
          '/dashboard-customer',
          '/dashboard-manager',
          '/create_app',
          '/user-page'
        ];
        let config = this.layout.getConfig();
        if (!withoutAsideUrl.some(s => event.url.startsWith(s)) && !withoutAsideUrl.some(s => event.urlAfterRedirects.startsWith(s))) {
          if (!config.aside.self.display) {
            document.body.style.opacity = '0';
            config.aside.self.display = true;
            this.layout.setConfigWithPageRefresh(config);
          }
        }
        else {
          if (config.aside.self.display) {
            if (this.currentUser === undefined) {
              document.body.style.opacity = '0';
              this.user.current().then(response => {
                if (response.user_type_id === 2 || response.user_type_id === 3) {
                  config.aside.self.display = false;
                  this.layout.setConfigWithPageRefresh(config);
                } else {
                  document.body.style.opacity = '1';
                }
              });
            } else {
              if (this.currentUser.user_type_id === 2 || this.currentUser.user_type_id === 3) {
                document.body.style.opacity = '0';
                config.aside.self.display = false;
                this.layout.setConfigWithPageRefresh(config);
              }
            }
          }
          else {
            if (this.currentUser === undefined) {
              document.body.style.opacity = '0';
              this.user.current().then(response => {
                if (response.user_type_id === 2 || response.user_type_id === 3) {
                  document.body.style.opacity = '1';
                } else {
                  config.aside.self.display = true;
                  this.layout.setConfigWithPageRefresh(config)
                }
              });
            } else {
              if (this.currentUser.user_type_id !== 2 && this.currentUser.user_type_id !== 3) {
                document.body.style.opacity = '0';
                config.aside.self.display = true;
                this.layout.setConfigWithPageRefresh(config);
              }
            }
          }
        }

        // clear filtration paginations and others
        this.tableService.setDefaults();
        // hide splash screen
        this.splashScreenService.hide();
        
        // scroll to top on every route change
        window.scrollTo(0, 0);

        // to display back the body content
        setTimeout(() => {
          document.body.classList.add('page-loaded');
        }, 500);
      }
    });
    this.unsubscribe.push(routerSubscription);

    this.loadMonaco();
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }


  /**
   * Preparation for monaco editor.
   */
  loadMonaco() {
    let loadPromise: Promise<void>;

    loadPromise = new Promise<void>((resolve: any) => {
      if (typeof ((<any>window).monaco) === 'object') {
        resolve();
        return;
      }
      const onAmdLoader: any = () => {
        // Load monaco
        (<any>window).require.config({paths: {'vs': 'assets/monaco/vs'}});

        (<any>window).require(['vs/editor/editor.main'], () => {
          resolve();
        });
      };

      // Load AMD loader if necessary
      if (!(<any>window).require) {
        const loaderScript: HTMLScriptElement = document.createElement('script');
        loaderScript.type = 'text/javascript';
        loaderScript.src = 'assets/monaco/vs/loader.js';
        loaderScript.addEventListener('load', onAmdLoader);
        document.body.appendChild(loaderScript);
      } else {
        onAmdLoader();
      }
    });
  }
}
