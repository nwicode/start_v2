import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {UserService} from '../../../services/user.service';
import {PreviewService} from '../../../services/preview.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { environment} from '../../../../environments/environment';

@Component({
  selector: 'app-preview-layer',
  templateUrl: './preview-layer.component.html',
  styleUrls: ['./preview-layer.component.scss']
})
export class PreviewLayerComponent implements OnInit {


  public default_language:string = "";
  public url:any = "";
  public pages:any = [];
  public languages:any = [];
  private app_id:number;

  constructor(private previewService:PreviewService, private userService:UserService, private sanitizer:DomSanitizer,private router: Router, private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.app_id = Number(this.router.url.match(/constructor\/(\d+)/)[1]);

    console.log(this.previewService.preview_loader);
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.previewService.preview_loader);

    this.previewService.get_preview(this.app_id).then(result=>{
      console.log("preivew return");
      console.log(result);
      this.pages = result.pages;
      this.languages = result.languages;
      this.default_language = result.default_language;
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(environment.apiUrl + result.url);
      this.ref.detectChanges();
    });
  }

  


  close() {
    this.userService.openPreview(false);
  }

  switchPage(page) {
    console.log(page);
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(environment.apiUrl + page.url);
  }

  set_anguage(lang) {
    this.default_language = lang;
    console.log(this.default_language);
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.previewService.preview_loader);
    this.previewService.get_preview(this.app_id,this.default_language).then(result=>{
      console.log(this.default_language);
      console.log("preivew return");
      console.log(result);
      //this.pages = result.pages;
      //this.languages = result.languages;
      //this.default_language = result.default_language;
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(environment.apiUrl + result.url);
      this.ref.detectChanges();
    });    
  }
}
