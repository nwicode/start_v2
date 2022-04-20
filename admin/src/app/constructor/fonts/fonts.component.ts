import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {TranslationService} from "../../services/translation.service";
import {SubheaderService} from "../ConstructorComponents/subheader/_services/subheader.service";
import {ToastService} from "../../platform/framework/core/services/toast.service";
import {Router} from "@angular/router";
import {ApplicationService} from "../../services/application.service";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-fonts',
  templateUrl: './fonts.component.html',
  styleUrls: ['./fonts.component.scss']
})
export class FontsComponent implements OnInit {

  isLoading$: Observable<boolean>;
  isLoading = false;

  applicationId: number;

  fonts: any[];
  selectedFont: any;

  constructor(private translationService: TranslationService, private subheader: SubheaderService, private toastService: ToastService, private router: Router, private applicationService: ApplicationService, private http: HttpClient) { }

  ngOnInit(): void {
    this.applicationId = Number(this.router.url.match(/constructor\/(\d+)/)[1]);
    let googleApiKey = 'AIzaSyBFYeu-PUiwBc6o9Sa8_6Y1n7mX2bV0xwo';

    setTimeout(() => {
      this.subheader.setTitle('CONSTRUCTOR.FONTS.TITLE');
      this.subheader.setBreadcrumbs([{
        title: 'CONSTRUCTOR.FONTS.TITLE',
        linkText: 'CONSTRUCTOR.FONTS.TITLE',
        linkPath: '/constructor/' + this.applicationId + '/fonts'
      }]);
    }, 1);

    this.isLoading$ = new Observable<boolean>( observer => {
      observer.next(true);
      this.isLoading = true;

      this.http.get('https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=' + googleApiKey).toPromise().then(response => {
          this.fonts = (<any>response).items;
          this.isLoading = false;
          observer.next(false);
      });
    });
  }

  /**
   * Save selected font.
   */
  save() {
    if (!this.selectedFont) {
      return;
    }

    this.isLoading$ = new Observable<boolean>( observer => {
      observer.next(true);
      this.isLoading = true;
      let fontRequests = [];
      for (let i = 0; i < this.selectedFont.variants.length; i++) {
        fontRequests.push(this.http.get(this.selectedFont.files[this.selectedFont.variants[i]], {responseType: "blob"}).toPromise());
      }

      let fontsFiles = {};
      Promise.all(fontRequests).then(response => {
        let urlString = 'https://fonts.googleapis.com/css?family=' + this.selectedFont.family + ':';

        for (let i = 0; i < response.length; i++) {
          fontsFiles[this.selectedFont.variants[i]] = response[i];
          urlString = urlString + this.selectedFont.variants[i] + ',';
        }

        let fontConnectionFile;
        this.http.get(urlString, {responseType: "blob"}).toPromise().then(response => {
          fontConnectionFile = response;

          this.applicationService.setApplicationFont(String(this.applicationId), this.selectedFont.family, fontsFiles, fontConnectionFile).then(response => {
            if (response.is_error) {
              this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_NOT_SAVED'), 'danger');
            } else {
              this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_SAVED'), 'success');
            }
            this.isLoading = false;
            observer.next(false);
          });
        });
      });
    });
  }

  /**
   * Remove selected font.
   */
  cancel() {
    this.selectedFont = '';
  }
}
