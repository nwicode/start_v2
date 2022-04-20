import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import {ToastService} from '../../../framework/core/services/toast.service';
import { SubheaderService } from '../../../LayoutsComponents/subheader/_services/subheader.service';
import { TranslationService } from '../../../../services/translation.service';
import { SettingsService } from '../../../../services/settings.service';
import { ActivatedRoute } from '@angular/router';
import {ConfigService} from '../../../../services/config.service';

@Component({
  selector: 'app-inner-logo-edit',
  templateUrl: './inner-logo-edit.component.html',
  styleUrls: ['./inner-logo-edit.component.scss']
})
export class InnerLogoEditComponent implements OnInit {

  isLoading$: Observable<boolean>;
  inner_img:string = "";
  has_changes:boolean = false;

  config:any;

  constructor(private ref: ChangeDetectorRef, private configService: ConfigService, private route: ActivatedRoute, private translationService: TranslationService, private subheader: SubheaderService,private toastService: ToastService, private fb: FormBuilder, private settingsService: SettingsService) { }



  async ngOnInit(): Promise<void> {


    this.config = await this.configService.getConfig();

    this.inner_img = this.config.inner_logo;

    setTimeout(() => {
      this.subheader.setTitle('PAGE.SETTINGS_ASSETS.MENU_IMAGE');
      this.subheader.setBreadcrumbs([{
        title: 'PAGE.SETTINGS_ASSETS.TITLE',
        linkText: 'PAGE.SETTINGS_ASSETS.TITLE',
        linkPath: '/settings-meta'
      }]);
    }, 1);         
  }

  cancel() {
    this.inner_img = this.config.inner_logo;
    this.has_changes = false;
  }

  save() {
    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      this.settingsService.saveBrandImage("inner_logo",this.inner_img).then( res=> {
        this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_SAVED'), 'success');
      }).catch(err=>{
        this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_NOT_SAVED'), 'danger');
      }).finally(()=>{
        observer.next(false);
      });

    });
  }

  handleImageChange(ev:any) {
    this.inner_img=ev;
    this.has_changes = true;
  }
  handleImageReset(ev:Event) {
    this.inner_img="";
  }

}
