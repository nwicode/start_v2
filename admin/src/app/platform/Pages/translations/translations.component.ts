import { Component, OnInit } from '@angular/core';
import { TranslationService } from "../../../services/translation.service";
import { SubheaderService } from "../../LayoutsComponents/subheader/_services/subheader.service";

@Component({
  selector: 'app-languages',
  templateUrl: './translations.component.html',
  styleUrls: ['./translations.component.scss']
})
export class TranslationsComponent implements OnInit {

  languages: any = [];

  constructor(private subheader: SubheaderService, private translations: TranslationService) {
    
  }

  async ngOnInit() {
    await this.translations.readLanguages();
    this.languages = this.translations.getAvailableLanguages();
    setTimeout(() => {
      this.subheader.setTitle('PAGE.TRANSLATIONS.SETTINGS');
      this.subheader.setBreadcrumbs([{
        title: 'PAGE.TRANSLATIONS.TITLE',
        linkText: 'PAGE.TRANSLATIONS.TITLE',
        linkPath: '/translations'
      }]);
    }, 1);
  }

}
