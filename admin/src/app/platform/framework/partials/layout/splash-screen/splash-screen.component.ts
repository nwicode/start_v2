import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SplashScreenService } from './splash-screen.service';
import {ConfigService} from '../../../../../services/config.service';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss'],
})
export class SplashScreenComponent implements OnInit {
  
  logo_img: string = "/assets/images/spinner_logo.png";
  config: any;

  @ViewChild('splashScreen', { static: true }) splashScreen: ElementRef;

  constructor(
    private el: ElementRef,
    private configService: ConfigService,
    private splashScreenService: SplashScreenService
  ) {}

  async ngOnInit(): Promise<void> {
    this.config = await this.configService.getConfig();
    console.log("authSettions");
    console.log(this.config);
    if (this.config.logo_img !== undefined && this.config.spinner_logo!="") this.logo_img = this.config.spinner_logo; 

    this.splashScreenService.init(this.splashScreen);
  }
}
