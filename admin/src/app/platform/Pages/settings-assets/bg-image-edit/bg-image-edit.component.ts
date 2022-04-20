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
  selector: 'app-bg-image-edit',
  templateUrl: './bg-image-edit.component.html',
  styleUrls: ['./bg-image-edit.component.scss']
})
export class BgImageEditComponent implements OnInit {

  isLoading$: Observable<boolean>;
  left_logo_img:string = "";
  auth_color:string = "";
  text_logo_color:string = "";
  has_changes:boolean = false;
  has_changes_file:boolean = false;
  config:any;
  

  constructor(private ref: ChangeDetectorRef, private configService: ConfigService,  private route: ActivatedRoute, private translationService: TranslationService, private subheader: SubheaderService,private toastService: ToastService, private fb: FormBuilder, private settingsService: SettingsService) { }



  async ngOnInit(): Promise<void> {

    this.config = await this.configService.getConfig();

    this.left_logo_img = this.config.left_logo_img;
    this.auth_color = this.config.auth_color;
    this.text_logo_color = this.config.text_logo_color;

    setTimeout(() => {
      this.subheader.setTitle('PAGE.SETTINGS_ASSETS.AUTH_BACKGROUND_IMAGE');
      this.subheader.setBreadcrumbs([{
        title: 'PAGE.SETTINGS_ASSETS.TITLE',
        linkText: 'PAGE.SETTINGS_ASSETS.TITLE',
        linkPath: '/settings-meta'
      }]);
    }, 1);         
  }

  cancel() {
    this.left_logo_img = this.config.left_logo_img;
    this.auth_color = this.config.auth_color;
    this.has_changes = false;
    this.has_changes_file = false;
  }

  save() {
    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      let left_logo_img = this.left_logo_img;
      if (!this.has_changes_file) left_logo_img="-";
      this.settingsService.saveBrandImage("left_logo_img",left_logo_img,"auth_color",this.auth_color, "text_logo_color",this.text_logo_color).then( res=> {
        this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_SAVED'), 'success');
      }).catch(err=>{
        this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_NOT_SAVED'), 'danger');
      }).finally(()=>{
        observer.next(false);
      });

    });
  }

  handleImageChange(ev:any) {
    this.left_logo_img=ev;
    this.has_changes = true;
    this.has_changes_file = true;
  }
  handleImageReset(ev:Event) {
    this.left_logo_img="";
  }

  authColorChanged(ev:any) {
    this.has_changes = true;
  }
  logoColorChanged(ev:any) {
    this.has_changes = true;
  }
}
