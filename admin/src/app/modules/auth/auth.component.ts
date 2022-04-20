import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {TranslationService} from '../../services/translation.service';
import {ConfigService} from '../../services/config.service';
import {ContentService} from '../../services/content.service';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalComponent} from './modal/modal.component';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  today: Date = new Date();

  langs:any[] = [];

  config:any;

  left_logo_img: string = "/assets/images/left_image.png";
  auth_color: string = "#001E47";
  text_logo_color: string = "#986923";
  logo_img: string = "/assets/images/top_logo.png";

  constructor(private ref: ChangeDetectorRef, private configService: ConfigService, private translate: TranslationService, public contentService: ContentService, private modalService: NgbModal, private title: Title, private meta: Meta) { }


  async ngOnInit(): Promise<void> {
    await this.translate.readLanguages();
    this.langs = this.translate.getAvailableLanguages();
    document.body.classList.remove('dark-theme');
    //console.log(this.config);
    // fill settings
    this.config = await this.configService.getConfig();
    
    //console.log("config:");
    //console.log(this.config);
    /*if (this.config.auth_color !== undefined && this.config.auth_color!="") this.auth_color = this.config.auth_color; 
    if (this.config.text_logo_color !== undefined && this.config.auth_color!="") this.text_logo_color = this.config.text_logo_color; 
    if (this.config.left_logo_img !== undefined && this.config.left_logo_img!="") this.left_logo_img = this.config.left_logo_img; 
    if (this.config.logo_img !== undefined && this.config.logo_img!="") this.logo_img = this.config.logo_img; 
    */

    if (this.config.auth_color !== undefined && this.config.auth_color!="") this.auth_color = this.config.auth_color; 
    if (this.config.text_logo_color !== undefined && this.config.auth_color!="") this.text_logo_color = this.config.text_logo_color; 
    if (this.config.left_logo_img !== undefined && this.config.left_logo_img!="") this.left_logo_img = this.config.left_logo_img; 
    if (this.config.logo_img !== undefined && this.config.logo_img!="") this.logo_img = this.config.logo_img; 
    this.ref.detectChanges();
    

    this.setMeta(this.translate.getSelectedLanguage());
  }

  setMeta(lang:string){
    this.title.setTitle(this.config.meta[lang].META_TITLE);
    this.meta.addTag({property:"description",content:this.config.meta[lang].META_DESCRIPTION});
  }

  setlang(lang) {
    //console.log(lang);
    this.translate.setLanguage(lang.code);
    this.setMeta(lang.code);
  }


  /**
   * Open modal window with static page.
   *
   * @param code static page code
   */
  public openContent(code: string) {
    const currentAppLanguage = this.translate.getSelectedLanguage();
    this.contentService.downloadStaticPage(code).then(response => {
      const data =  response;
      let requiredEntry: { code: string, content: string, header: string };
      
      /*for (const item of data) {
        if (item.code === currentAppLanguage) {
          requiredEntry = item;
          break;
        }
      }*/

      data.pages.forEach(item => {
        if (item.code === currentAppLanguage) {
          requiredEntry = item;
        }        
      });

      if (requiredEntry !== undefined) {
        console.log(requiredEntry);
        const modalRef = this.modalService.open(ModalComponent, {
          size: 'lg',
          scrollable: true
        });
        modalRef.componentInstance.content = requiredEntry.content;
          modalRef.componentInstance.header = requiredEntry.header;
      }
    });
  }
}