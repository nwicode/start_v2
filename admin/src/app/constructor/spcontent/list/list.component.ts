import { Component, OnInit } from '@angular/core';
import { SubheaderService } from '../../ConstructorComponents/subheader/_services/subheader.service';
import {Observable, Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {ApplicationService} from '../../../services/application.service'
import { ActivatedRoute, Router } from '@angular/router';
import {TranslationService} from "../../../services/translation.service";
import {ToastService} from '../../../platform/framework/core/services/toast.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  isLoading$: Observable<boolean>;
  app_id: number;
  was_changed:boolean = false;
  was_loaded:boolean = false;
  application:any;
  in_app_products:any[] = [];

  constructor(private translationService: TranslationService, private router: Router, private toastService: ToastService, private activateRoute: ActivatedRoute, private subheader: SubheaderService, private applicationService:ApplicationService) { }


  ngOnInit(): void {

    this.app_id = Number(this.router.url.match(/constructor\/(\d+)/)[1]);
    setTimeout(() => {
      this.subheader.setTitle('CONSTRUCTOR.SPCONTENT.TITLE');
    }, 1);    
  
    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      this.applicationService.getApplicationById(this.app_id).then(data=>{
        this.application = data;
        data.in_app_products.forEach(iap => {
          iap.confirm_delete = false;
          this.in_app_products.push(iap);
        });

        this.was_loaded = true;

        observer.next(false);
      }).finally( ()=>{
        //observer.next(false);
      });
    });      
  }

  removeIap(product:any) {
    this.isLoading$ = new Observable<boolean>(observer => {
      this.applicationService.removeApplicationIAP(this.app_id, product.id).then( data =>{
        this.was_loaded = false;
        this.in_app_products = [];

        data.in_app_products.forEach(iap => {
          iap.confirm_delete = false;
          this.in_app_products.push(iap);
        });
        this.was_loaded = true;
        observer.next(false);
      }).finally( ()=>{
        //observer.next(false);
      });
    });       
  }


}
