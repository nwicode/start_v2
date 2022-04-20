import {
    Component,
    OnInit,
    ViewChild,
    ElementRef,
    AfterViewInit,
} from '@angular/core';
import {LayoutService, LayoutInitService} from '../platform/framework/core';
import KTLayoutContent from '../../assets/js/layout/base/content';
import KTLayoutAside from '../../assets/js/layout/base/aside';
import KTLayoutAsideMenu from '../../assets/js/layout/base/aside-menu';
import KTLayoutBrand from '../../assets/js/layout/base/brand';
import KTLayoutAsideToggle from '../../assets/js/layout/base/aside-toggle';
import KTLayoutHeaderTopbar from '../../assets/js/layout/base/header-topbar';
import {UserService} from '../services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from '../../environments/environment';
import {NotificationsService} from '../services/notifications.service';
import {ConstructorDynamicAsideMenuService} from './ConstructorComponents/aside-menu/services/constructor-dynamic-aside-menu.service';
import {ApplicationUsersService} from '../services/application-users.service';

@Component({
    selector: 'app-constructor',
    templateUrl: './constructor.component.html',
    styleUrls: ['./constructor.component.scss'],
    providers: [ConstructorDynamicAsideMenuService]
})
export class ConstructorComponent implements OnInit {

    checkInterval: any;
    checkNotify: any;
    generatePrreview: boolean = false;

    // Public variables
    selfLayout = 'default';
    asideSelfDisplay: true;
    asideMenuStatic: true;
    contentClasses = '';
    contentContainerClasses = '';
    subheaderDisplay = true;
    contentExtended: false;
    asideCSSClasses: string;
    asideHTMLAttributes: any = {};
    headerMobileClasses = '';
    headerMobileAttributes = {};
    footerDisplay: boolean;
    footerCSSClasses: string;
    headerCSSClasses: string;
    headerHTMLAttributes: any = {};
    // offcanvases
    extrasSearchOffcanvasDisplay = false;
    extrasNotificationsOffcanvasDisplay = false;
    extrasQuickActionsOffcanvasDisplay = false;
    extrasCartOffcanvasDisplay = false;
    extrasUserOffcanvasDisplay = false;
    extrasQuickPanelDisplay = false;
    extrasScrollTopDisplay = false;
    @ViewChild('ktAside', {static: true}) ktAside: ElementRef;
    @ViewChild('ktHeaderMobile', {static: true}) ktHeaderMobile: ElementRef;
    @ViewChild('ktHeader', {static: true}) ktHeader: ElementRef;

    constructor(private initService: LayoutInitService, private layout: LayoutService, private user: UserService,
                private notificationService: NotificationsService, private route: ActivatedRoute, private router: Router,
                private applicationUsersService: ApplicationUsersService) {
        this.initService.init();

        // run user activity update timers
        this.checkInterval = setInterval(async () => {
            //console.log("run user update");
            let update_result = await this.user.check_me();
            //console.log(update_result);
            if (update_result.is_error || update_result.blocked == 1 || !update_result.logined) {
                clearInterval(this.checkInterval);
                this.router.navigate(['/auth/login', 'SESSION_EXPIRED']);
            } else {

            }

        }, 30000);

        /*this.checkNotify = setInterval(async ()=>{
          //console.log("run user update");
          await this.notificationService.loadNotifications();
        },15000);*/

        this.user.onOpenPreview().subscribe( (event: boolean) => {
            this.generatePrreview = event;
            //console.log(event);
        })

    }

    ngOnInit(): void {

        const appID = this.route.snapshot.paramMap.get('app_id');
        console.log('APP_ID', appID);
        this.applicationUsersService.setAppId(appID);

        let theme = localStorage.getItem(environment.appPrefix + 'theme');

        if (theme && theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }

        this.headerMobileClasses = this.layout.getStringCSSClasses('header_mobile');
        this.selfLayout = this.layout.getProp('self.layout');
        this.asideSelfDisplay = this.layout.getProp('aside.self.display');
        this.asideMenuStatic = this.layout.getProp('aside.menu.static');
        this.subheaderDisplay = this.layout.getProp('subheader.display');
        this.contentClasses = this.layout.getStringCSSClasses('content');
        this.contentContainerClasses = this.layout.getStringCSSClasses('content_container');
        this.contentExtended = this.layout.getProp('content.extended');
        this.asideHTMLAttributes = this.layout.getHTMLAttributes('aside');
        this.asideCSSClasses = this.layout.getStringCSSClasses('aside');
        this.headerMobileClasses = this.layout.getStringCSSClasses('header_mobile');
        this.headerMobileAttributes = this.layout.getHTMLAttributes(
            'header_mobile'
        );
        this.footerDisplay = this.layout.getProp('footer.display');
        this.footerCSSClasses = this.layout.getStringCSSClasses('footer');
        this.headerCSSClasses = this.layout.getStringCSSClasses('header');
        this.headerHTMLAttributes = this.layout.getHTMLAttributes('header');
        // offcanvases
        if (this.layout.getProp('extras.search.display')) {
            this.extrasSearchOffcanvasDisplay =
                this.layout.getProp('extras.search.layout') === 'offcanvas';
        }

        if (this.layout.getProp('extras.notifications.display')) {
            this.extrasNotificationsOffcanvasDisplay =
                this.layout.getProp('extras.notifications.layout') === 'offcanvas';
        }

        if (this.layout.getProp('extras.quickActions.display')) {
            this.extrasQuickActionsOffcanvasDisplay =
                this.layout.getProp('extras.quickActions.layout') === 'offcanvas';
        }

        if (this.layout.getProp('extras.cart.display')) {
            this.extrasCartOffcanvasDisplay =
                this.layout.getProp('extras.cart.layout') === 'offcanvas';
        }

        if (this.layout.getProp('extras.user.display')) {
            this.extrasUserOffcanvasDisplay =
                this.layout.getProp('extras.user.layout') === 'offcanvas';
        }

        this.extrasQuickPanelDisplay = this.layout.getProp(
            'extras.quickPanel.display'
        );

        this.extrasScrollTopDisplay = this.layout.getProp(
            'extras.scrolltop.display'
        );

        this.user.downloadCountries();

        setTimeout(() => {
            KTLayoutBrand.init('kt_brand');
            KTLayoutAside.init('kt_aside');
            KTLayoutAsideMenu.init('kt_aside_menu');
            KTLayoutAsideMenu.init('kt_aside_menu_sm');
            KTLayoutAsideToggle.init('kt_aside_toggle');
            KTLayoutHeaderTopbar.init('kt_header_mobile_topbar_toggle');
        }, 1000);
    }

    ngAfterViewInit(): void {

        // Init Content
        KTLayoutContent.init('kt_content');
    }

}
