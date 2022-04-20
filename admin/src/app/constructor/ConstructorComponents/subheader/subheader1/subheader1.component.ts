import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { LayoutService } from '../../../../platform/framework/core';
import { SubheaderService } from '../_services/subheader.service';
import { BreadcrumbItemModel } from '../_models/breadcrumb-item.model';
import {ApplicationService} from '../../../../services/application.service';
import {UserService} from '../../../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-subheader1',
  templateUrl: './subheader1.component.html',
  styleUrls: ['./subheader1.component.scss']
})
export class Subheader1Component implements OnInit {
  subheaderCSSClasses = '';
  subheaderContainerCSSClasses = '';
  subheaderMobileToggle = false;
  subheaderDisplayDesc = false;
  subheaderDisplayDaterangepicker = false;
  title$: Observable<string>;
  breadcrumbs$: Observable<BreadcrumbItemModel[]>;
  breadcrumbs: BreadcrumbItemModel[] = [];
  description$: Observable<string>;
  @Input() title: string;
  app_id:any;

  show_preview: boolean = false;

  constructor(
    private layout: LayoutService,
    private subheader: SubheaderService,
    private applicationService:ApplicationService,
    private activateRoute: ActivatedRoute, 
    private router: Router,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {
    this.title$ = this.subheader.titleSubject.asObservable();
    this.app_id = activateRoute.snapshot.params['app_id'];
    console.log("app_id");
    console.log(this.app_id);    
  }

  ngOnInit() {
    this.title$ = this.subheader.titleSubject.asObservable();
    this.breadcrumbs$ = this.subheader.breadCrumbsSubject.asObservable();
    this.description$ = this.subheader.descriptionSubject.asObservable();
    this.subheaderCSSClasses = this.layout.getStringCSSClasses('subheader');
    this.subheaderContainerCSSClasses = this.layout.getStringCSSClasses(
      'subheader_container'
    );
    this.subheaderMobileToggle = this.layout.getProp('subheader.mobileToggle');
    this.subheaderDisplayDesc = this.layout.getProp('subheader.displayDesc');
    this.subheaderDisplayDaterangepicker = this.layout.getProp(
      'subheader.displayDaterangepicker'
    );
    this.breadcrumbs$.subscribe((res) => {
      this.breadcrumbs = res;
      this.cdr.detectChanges();
    });
  }


  /**
   * 
   * @param mode open in device
   */
  openPreview(mode:string) {

    let applicationId = Number(this.router.url.match(/constructor\/(\d+)/)[1]);

    let url = '/preview/'+applicationId;
    let url_tablet = '/preview-tablet/'+applicationId;
    let url_browser = '/storage/application/1-FXgI3xtwFo/www';
    if (mode=="smartphone") window.open(url,'targetWindow','toolbar=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=400, height=700');
    else if (mode=="tablet") window.open(url_tablet,'targetWindow','toolbar=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=700, height=500');
    else if (mode=="browser") {
      
      this.applicationService.getApplicationById(applicationId).then( result=> {
        url_browser = environment.apiUrl+"storage/application/"+result.id+"-"+result.unique_string_id+"/sources/www/";
        window.open(url_browser)
      });

      
    };
  }


  generatePreview() {
    this.userService.openPreview();
  }
}
