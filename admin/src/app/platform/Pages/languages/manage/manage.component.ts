import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import {UserService} from '../../../../services/user.service';
import {TranslationService} from '../../../../services/translation.service';
import {ToastService} from '../../../framework/core/services/toast.service';
import { SubheaderService } from '../../../LayoutsComponents/subheader/_services/subheader.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  languages: any[];
  default_language: string;
  isLoading$: Observable<boolean>;
  constructor(private subheader: SubheaderService,private toastService: ToastService, private userService: UserService, private fb: FormBuilder, private translationService: TranslationService) { }

  async ngOnInit()  {
    setTimeout(() => {
      this.subheader.setTitle('PAGE.LANGUAGES.DEFAULT_LANGUAGE');
      this.subheader.setBreadcrumbs([{
        title: 'PAGE.LANGUAGES.TITLE',
        linkText: 'PAGE.LANGUAGES.TITLE',
        linkPath: '/languages'
      }]);
    }, 1);
    await this.translationService.readLanguages();    
    this.languages = this.translationService.getAvailableLanguages();
    this.languages.forEach(l => {
      if (l.is_default==1) this.default_language = l.code;
    });
    console.log(this.languages);
  }


  /**
   * Remove language
   * @param language language item
   */
  deletelanguage(language:any) {

    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      language.confirm_delete=false
      this.translationService.deleteLanguage(language.code).then(res =>{
        console.log("deletelanguage result");
        console.log(res);
        observer.next(false);
        window.location.reload();
      })
      
    });

  }

}
