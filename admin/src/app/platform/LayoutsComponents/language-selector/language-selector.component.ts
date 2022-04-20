import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import {TranslationService} from '../../../services/translation.service';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss'],
})
export class LanguageSelectorComponent implements OnInit {

  langs:any[] = [];

  current_flag: string = "";

  constructor(
    private translate: TranslationService,
    private translationService: TranslationService,
    private router: Router
  ) { }

  async ngOnInit() {
    await this.translationService.readLanguages();
    let l = this.translate.getSelectedLanguage();
    console.log(l);
    this.current_flag = "./assets/languages/"+l+".png";
    this.langs = this.translate.getAvailableLanguages();
    /*this.setSelectedLanguage();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((event) => {
        this.setSelectedLanguage();
      });
      this.langs = this.translate.getAvailableLanguages();
      console.log(this.langs);*/
  }

  setlang(lang) {
    //console.log(lang);
    if(lang.code == this.translate.getSelectedLanguage()) {
      this.translate.setLanguage(lang.code);
      }else {
        this.setLangWithRefresh(lang.code);
      }
    }

  setLangWithRefresh(lang) {
    this.translate.setLanguage(lang);
    window.location.reload();
  }
}