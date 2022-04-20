import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {TranslationService} from "../../services/translation.service";
import {ToastService} from "../../platform/framework/core/services/toast.service";
import {SubheaderService} from '../ConstructorComponents/subheader/_services/subheader.service';
import {ApplicationService} from "../../services/application.service";
import {BuildService} from "../../services/build.service";
import {environment} from '../../../environments/environment';
import { P } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-build',
  templateUrl: './build.component.html',
  styleUrls: ['./build.component.scss']
})
export class BuildComponent implements OnInit {

  app_id:number;
  base_path:string = "";
  www_last_generation_date:string = "";
  www_link:string = "";
  was_loaded: boolean = false;
  has_building: boolean = false;
  timer_started: boolean = false;
  can_generate_apk: boolean = false;
  can_generate_aab: boolean = false;
  can_generate_android_sources: boolean = false;
  can_generate_ipa: boolean = false;
  can_generate_ios_sources: boolean = false;
  can_generate_pwa: boolean = false;
  can_generate_www: boolean = false;
  queue: any[] = [];
  isLoading$: Observable<boolean>;

  refreshTimer: any;

  constructor(private changeDetectorRef: ChangeDetectorRef, private translationService: TranslationService, private subheader: SubheaderService, private toastService: ToastService, private formBuilder: FormBuilder, private router: Router, private applicationService: ApplicationService, private buildService: BuildService) { 
    this.base_path = environment.apiUrl;
  }

  ngOnInit(): void {
    this.app_id = Number(this.router.url.match(/constructor\/(\d+)/)[1]);

    setTimeout(() => {
      this.subheader.setTitle('CONSTRUCTOR.BUILD.TITLE');
    }, 1);
    
    this.isLoading$ = new Observable<boolean>( observer => {
      observer.next(true);

      this.buildService.loadQueue(this.app_id).then(result => {
        this.parseData(result);
        this.was_loaded = true;
        observer.next(false);
      });
    });  

  }

  /**
   * parse response and prepare array
   * @param result 
   */

  parseData(result:any) {
    this.can_generate_apk = result.can_generate_apk;
    this.can_generate_aab = result.can_generate_aab;
    this.can_generate_android_sources = result.can_generate_android_sources;
    this.can_generate_ipa = result.can_generate_ipa;
    this.can_generate_ios_sources = result.can_generate_ios_sources;
    this.can_generate_pwa = result.can_generate_pwa;
    this.can_generate_www = result.can_generate_www;
    this.www_last_generation_date = result.www_last_generation_date;
    this.www_link = result.www_link;
    this.has_building = result.has_building;

    this.queue = result.queue;
    if (result.has_building) {
      this.startUpdateTimer();
    } else {
      clearTimeout(this.refreshTimer);
      this.timer_started = false;
    }
    this.changeDetectorRef.detectChanges();
  }


  startUpdateTimer() {
    this.timer_started = true;
    this.refreshTimer = setTimeout(() => {
      this.buildService.loadQueue(this.app_id).then(result => {
        this.parseData(result);
      });
    }, 10000);
  }

  /**
   * Run android generation
   */
  buildAndroid() {
    this.buildService.buildAndroidDebug(this.app_id).then( response=>{
      console.log("Build done");
      console.log(response);
      this.toastService.showsToastBar(this.translationService.translatePhrase('CONSTRUCTOR.BUILD.SUCCESSFULLY_ENQUEUED'), 'success');

      this.buildService.loadQueue(this.app_id).then(result => {
        this.parseData(result);
      });      
    }).catch( err =>{
      console.error("Build error");
      console.log(err);
    });
  }

  /**
   * Run android generation
   */
  buildAndroidSrc() {
    this.buildService.buildAndroidSrc(this.app_id).then( response=>{
      console.log("Build done");
      console.log(response);
      this.toastService.showsToastBar(this.translationService.translatePhrase('CONSTRUCTOR.BUILD.SUCCESSFULLY_ENQUEUED'), 'success');

      this.buildService.loadQueue(this.app_id).then(result => {
        this.parseData(result);
      });      
    }).catch( err =>{
      console.error("Build error");
      console.log(err);
    });
  }

  /**
   * Run android generation
   */
  buildAndroidAAB() {
    this.buildService.buildAndroidDebug(this.app_id).then( response=>{
      console.log("Build done");
      console.log(response);
      this.toastService.showsToastBar(this.translationService.translatePhrase('CONSTRUCTOR.BUILD.SUCCESSFULLY_ENQUEUED'), 'success');

      this.buildService.loadQueue(this.app_id).then(result => {
        this.parseData(result);
      });      
    }).catch( err =>{
      console.error("Build error");
      console.log(err);
    });
  }

  /**
   * Run WWW generation
   */
  buildWeb() {
    this.buildService.buildWWW(this.app_id).then( response=>{
      console.log("Build done");
      console.log(response);
      this.toastService.showsToastBar(this.translationService.translatePhrase('CONSTRUCTOR.BUILD.SUCCESSFULLY_ENQUEUED'), 'success');

      this.buildService.loadQueue(this.app_id).then(result => {
        this.parseData(result);
      });      
    }).catch( err =>{
      console.error("Build error");
      console.log(err);
    });
  }

  openWeb() {

  }
  /**
   * Run ios generation
   */
  buildIOSSrc() {
    this.buildService.buildIOSSrc(this.app_id).then( response=>{
      console.log("Build done");
      console.log(response);
      this.toastService.showsToastBar(this.translationService.translatePhrase('CONSTRUCTOR.BUILD.SUCCESSFULLY_ENQUEUED'), 'success');

      this.buildService.loadQueue(this.app_id).then(result => {
        this.parseData(result);
      });
    }).catch( err =>{
      console.error("Build error");
      console.log(err);
    });
  }
}
