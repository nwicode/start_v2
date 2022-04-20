import { Component, OnInit } from '@angular/core';
import { SubheaderService } from '../../LayoutsComponents/subheader/_services/subheader.service';
import { TranslationService } from '../../../modules/i18n/translation.service';

@Component({
  selector: 'app-translations',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss']
})
export class LanguagesComponent implements OnInit {

  languages: any = [];
  constructor(private subheader: SubheaderService, private tranlsations: TranslationService) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.subheader.setTitle('PAGE.LANGUAGES.SETTINGS');
      this.subheader.setBreadcrumbs([{
        title: 'PAGE.LANGUAGES.TITLE',
        linkText: 'PAGE.LANGUAGES.TITLE',
        linkPath: '/languages'
      }]);
    }, 1);


    //Load languages
  }

}
