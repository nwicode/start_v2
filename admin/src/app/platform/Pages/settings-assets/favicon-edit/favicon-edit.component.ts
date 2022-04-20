import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {SubheaderService} from "../../../LayoutsComponents/subheader/_services/subheader.service";
import {ToastService} from "../../../framework/core/services/toast.service";
import {TranslationService} from "../../../../services/translation.service";
import {environment} from "../../../../../environments/environment";
import {SettingsService} from "../../../../services/settings.service";

@Component({
  selector: 'app-favicon-edit',
  templateUrl: './favicon-edit.component.html',
  styleUrls: ['./favicon-edit.component.scss']
})
export class FaviconEditComponent implements OnInit {

  isLoading$: Observable<boolean>;
  has_changes: boolean = false;
  favicon_img: string = '';
  config:any;

  constructor(private subheader: SubheaderService,private toastService: ToastService,private translationService: TranslationService, private settingsService: SettingsService) { }

  ngOnInit(): void {

    setTimeout(() => {
      this.subheader.setTitle('PAGE.FAVICON_EDIT.TITLE');
      this.subheader.setBreadcrumbs([{
        title: 'PAGE.SETTINGS_ASSETS.TITLE',
        linkText: 'PAGE.SETTINGS_ASSETS.TITLE',
        linkPath: '/settings-meta'
      }]);
    }, 1);

    this.isLoading$ = new Observable<boolean>( observer => {
      observer.next(true);
      this.settingsService.getFavicon().then(response => {
        if (!response.is_error) {
          this.favicon_img = response.favicon;
        } else {
          this.favicon_img = '';
        }
        observer.next(false);
      });
    });
  }

  save() {
    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);

      this.settingsService.setFavicon(this.favicon_img).then(response => {
        if (response.is_error) {
          this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_NOT_SAVED'), 'danger');
        } else {
          this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_SAVED'), 'success');
        }
      }).finally(()=>{
        observer.next(false);
      });
    });
  }

  cancel() {
    this.isLoading$ = new Observable<boolean>( observer => {
      observer.next(true);
      this.settingsService.getFavicon().then(response => {
        if (!response.is_error) {
          this.favicon_img = response.favicon;
        } else {
          this.favicon_img = '';
        }
        observer.next(false);
      });
    });
    this.has_changes = false;
  }

  handleImageChange(ev:any) {
    this.favicon_img = ev;
    this.has_changes = true;
  }
  handleImageReset(ev:Event) {
    this.isLoading$ = new Observable<boolean>( observer => {
      observer.next(true);
      this.settingsService.getFavicon().then(response => {
        if (!response.is_error) {
          this.favicon_img = response.favicon;
        } else {
          this.favicon_img = '';
        }
        observer.next(false);
      });
    });
    this.has_changes = false;
  }
}
