import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SubheaderService } from '../../LayoutsComponents/subheader/_services/subheader.service';
import {ToastService} from '../../framework/core/services/toast.service';
import { SdkService } from '../../../services/sdk.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-settings-sdk',
  templateUrl: './settings-sdk.component.html',
  styleUrls: ['./settings-sdk.component.scss']
})
export class SettingsSdkComponent implements OnInit {

  isLoading$: Observable<boolean>;
  config: any = {};
  gradle_install_process: boolean = false;
  ionic_install_process: boolean = false;
  android_tools_install_process: boolean = false;

  timer_running: boolean = false;

  check_timer:any;

  constructor(private ref: ChangeDetectorRef, private sdk:SdkService, private subheader: SubheaderService,private toastService: ToastService,) { }

  ngOnInit(): void {

    setTimeout(() => {
      this.subheader.setTitle('PAGE.SETTINGS_SDK.TITLE');
      this.subheader.setBreadcrumbs([{
        title: 'PAGE.SETTINGS_SDK.TITLE',
        linkText: 'PAGE.SETTINGS_SDK.TITLE',
        linkPath: '/settings-sdk'
      }]);
    }, 1)

    console.log("load")
    this.isLoading$ = new Observable<boolean>( observer => {
      observer.next(true);

      this.sdk.checkSDK().then (check_result=>{
        console.log("check_result");
        console.log(check_result);
        this.config = check_result;
        this.android_tools_install_process = this.config.android_build_tools_installing;
        this.ionic_install_process = this.config.ionic_installing;        
        this.runCheckTimer();

        observer.next(false);
      })

      
    });

  }

  runCheckTimer() {
    if (this.timer_running) return;
    this.timer_running = true;
    console.log("runCheckTimer:");
    this.check_timer = setTimeout( ()=>{

      this.sdk.checkSDK().then (check_result=>{
        console.log("runCheckTimer check_result:");
        console.log(check_result);
        this.config = check_result;

        this.android_tools_install_process = this.config.android_build_tools_installing;
        this.ionic_install_process = this.config.ionic_installing;

        this.timer_running = false;
        this.ref.detectChanges();
        this.runCheckTimer();
      })
      
    },10000);
  }

  installGradle() {
    this.gradle_install_process = true;
    this.sdk.installGradle().then( res=>{
      console.log("gradle install result");
      console.log(res);
      this.gradle_install_process = false;
      if (res.success) this.config.gradle_installed = true;
      this.ref.detectChanges();
    });
  }

  installAndroidTools() {
    this.android_tools_install_process = true;
    this.config.android_build_tools_installing = true;
    this.config.android_build_tools_installed = false;
    this.sdk.installAndroidTools().then( res=>{
      console.log("installAndroidTools install result");
      console.log(res);
      this.android_tools_install_process = true;
      this.config.android_build_tools_installing = true;
      this.config.android_build_tools_installed = false;
      this.ref.detectChanges();
    });
  }

  installIonic() {
    this.ionic_install_process = true;
    this.config.ionic_installing = true;
    this.config.ionic_installed = false;
    this.ref.detectChanges();
    this.sdk.installIonic().then( res=>{
      console.log("ionic install result");
      console.log(res);
      this.config.ionic_installing = true;
      this.ref.detectChanges();
    });
  }

}
