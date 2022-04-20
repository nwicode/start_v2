import { Component, OnInit, AfterViewInit } from '@angular/core';
import {LayoutService } from '../../../platform/framework/core';
import KTLayoutFooter from '../../../../assets/js/layout/base/footer';
import {ConfigService} from '../../../services/config.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, AfterViewInit {

  footerContainerCSSClasses: string;
  currentYear: string;
  footerDomain: string;
  currentPlatform: string;
  currentVersion: string;
  config: any;

  constructor(private layout: LayoutService, private configService: ConfigService,) {
    const currentDate = new Date();
    this.currentYear = currentDate.getFullYear().toString();    
  }

  async ngOnInit(): Promise<void> {
    this.footerContainerCSSClasses = this.layout.getStringCSSClasses(
      'footer_container'
    );
    this.footerDomain = window.location.hostname;

    this.config = await this.configService.getConfig();

    this.currentPlatform = this.config.platform;
    this.currentVersion = this.config.version;
  }

  ngAfterViewInit() {
    // Init Footer
    KTLayoutFooter.init('kt_footer');
  }  

}
