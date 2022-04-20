import { Component, OnInit, NgZone  } from '@angular/core';
import { Observable } from 'rxjs';
import {SystemSettingsService} from "./../_services/system/system-settings.service";
import { NavController } from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit {

  timer:any;
  timeout: number = 123456;

  settings_loaded: boolean = false;
  timeout_ended: boolean = false;
  next_page: string = "";

  constructor(private translate: TranslateService, private systemSettingsService:SystemSettingsService, private navCtrl: NavController, private ngZone: NgZone) { }

  async ngOnInit() {


  }
  
   async ionViewDidEnter() {

    setTimeout(() => {
      this.timeout_ended = true;
	  this.goToNextpage();
    }, this.timeout);


    this.systemSettingsService.settingsLoadErrorEvent().subscribe(data=>{
      console.log("navigate to netword error page");
      this.navCtrl.navigateForward('network-error');
    });


    this.systemSettingsService.loadSystemSettings().then(data =>{
      
      let settings = data.settings;

      //set translations
      settings.languages.forEach(language => {
        console.log(language);  
        this.translate.setTranslation(language.language,language.items,true);
      });

      this.translate.setDefaultLang(settings.default_language);
      this.translate.use(settings.default_language);
	  localStorage.setItem("app_"+environment.appId+"_default_language",settings.default_language);

      if (settings.disabled==1 || settings.blocked==1) {
        this.navCtrl.navigateForward('application-blocked');
      }

      this.next_page = settings.next_page;

      this.settings_loaded = true;
      this.goToNextpage();
      //this.translate.setDefaultLang(set)
    });	  
  }

  goToNextpage() {
    if (this.settings_loaded && this.timeout_ended) this.navCtrl.navigateForward(this.next_page);
  }




}
