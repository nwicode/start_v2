import { Component, OnInit, AfterViewInit } from '@angular/core';
import { LayoutService } from '../../../platform/framework/core';
import {ConfigService} from '../../../services/config.service';


@Component({
  selector: 'app-header-mobile',
  templateUrl: './header-mobile.component.html',
  styleUrls: ['./header-mobile.component.scss'],
})
export class HeaderMobileComponent implements OnInit, AfterViewInit {
  headerLogo = '';
  asideSelfDisplay = true;
  headerMenuSelfDisplay = true;
  headerMobileClasses = '';
  headerMobileAttributes = {};
  config: any;
  constructor(private layout: LayoutService, private configService: ConfigService) {}

  async ngOnInit(): Promise<void> {

    this.config = await this.configService.getConfig();

    // build view by layout config settings
    this.headerMobileClasses = this.layout.getStringCSSClasses('header_mobile');
    this.headerMobileAttributes = this.layout.getHTMLAttributes(
      'header_mobile'
    );

    //this.headerLogo = this.getLogoUrl();
    this.asideSelfDisplay = this.layout.getProp('aside.self.display');
    this.headerMenuSelfDisplay = this.layout.getProp(
      'header.menu.self.display'
    );
    this.headerLogo = this.config.inner_logo;
  }

  ngAfterViewInit() {
    // Init Header Topbar For Mobile Mode
    // KTLayoutHeaderTopbar.init('kt_header_mobile_topbar_toggle');
  }

  private getLogoUrl() {
    return `./assets/media/platform/logo.png`;
  }
}
