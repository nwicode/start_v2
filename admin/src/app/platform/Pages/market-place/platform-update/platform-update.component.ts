import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {LicenseService} from '../../../../services/license.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ConfigService } from '../../../../services/config.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SubheaderService } from '../../../LayoutsComponents/subheader/_services/subheader.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-platform-update',
  templateUrl: './platform-update.component.html',
  styleUrls: ['./platform-update.component.scss']
})
export class PlatformUpdateComponent implements OnInit {

  checked:boolean = false;
  has_update:boolean = false;
  update_done:boolean = false;
  currentVersion:string = "";
  currentPlatform:string = "";
  lastCheckDate:any;
  update_info:any;
  message:any;
  summary:any;
  release_date:any;
  config:any;
  checking_process:boolean = true;
  updating_process:boolean = false;
  constructor(private router:Router, private subheader: SubheaderService,  private sanitizer:DomSanitizer, private ref: ChangeDetectorRef, private configService: ConfigService,  public licenseService: LicenseService, private modalService: NgbModal) { }

  async ngOnInit(): Promise<void> {

    setTimeout(() => {
      this.subheader.setTitle('PAGE.MARKETPLACE.PLATFORM_UPDATE');
      this.subheader.setBreadcrumbs([{
        title: 'PAGE.MARKETPLACE.TITLE',
        linkText: 'PAGE.MARKETPLACE.TITLE',
        linkPath: '/marketplace'
      }]);
    }, 1);    

    this.check();
  }


  check() {
    this.checking_process = true;
    this.update_done = false;
    this.licenseService.checkUpdates().then(async res=>{ 
      console.log("this.licenseService.checkUpdates");
      console.log(res);
      this.config = await this.configService.getConfig();
      console.log(this.config);
      this.currentVersion = this.config.version;
      this.currentPlatform = this.config.platform.toUpperCase();
      this.lastCheckDate = "-";
      if (this.config.last_check_date) this.lastCheckDate = this.config.last_check_date;
      this.checking_process = false;
      this.checked = true;
      if (!res.status) {
        this.has_update = false;
      } else {
        this.has_update = true;
        this.update_info = this.sanitizer.bypassSecurityTrustHtml(res.changelog);
        this.summary = this.sanitizer.bypassSecurityTrustHtml(res.summary);
        this.message = this.sanitizer.bypassSecurityTrustHtml(res.message);
        this.release_date = this.sanitizer.bypassSecurityTrustHtml(res.release_date);
      }

      this.ref.detectChanges();
    });
  }


  update() {  
    this.updating_process = true;
    this.licenseService.runUpdate().then(async res=>{ 
      console.log("this.licenseService.checkUpdates");
      console.log(res);
      this.update_done = true;
      this.updating_process = false;
      this.ref.detectChanges();
      setTimeout( ()=>{
        //window.location.reload();
        this.router.navigate(['/dashboard']);
      },3000);
    });
  } 

}
