import { Component, OnInit } from '@angular/core';
import { SubheaderService } from '../ConstructorComponents/subheader/_services/subheader.service';
import {Observable, Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {ApplicationService} from '../../services/application.service'
import { ActivatedRoute, Router } from '@angular/router';
import {TranslationService} from "../../services/translation.service";
import {ToastService} from '../../platform/framework/core/services/toast.service';

@Component({
  selector: 'app-spcontent',
  templateUrl: './spcontent.component.html',
  styleUrls: ['./spcontent.component.scss']
})
export class SPContentComponent implements OnInit {

  isLoading$: Observable<boolean>;
  app_id: number;
  was_changed:boolean = false;
  was_loaded:boolean = false;
  application:any;
  in_app_products:any[] = [];

  constructor(private translationService: TranslationService, private router: Router, private toastService: ToastService, private activateRoute: ActivatedRoute, private subheader: SubheaderService, private applicationService:ApplicationService) { }


  ngOnInit(): void {

    
  }


  cancel() {

  }

  save() {

  }

}
