import { Component, OnInit } from '@angular/core';
import { SubheaderService } from '../ConstructorComponents/subheader/_services/subheader.service';
import {Observable, Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {ApplicationService} from '../../services/application.service'
import { ActivatedRoute, Router } from '@angular/router';
import {TranslationService} from "../../services/translation.service";
import {NewsService} from "../../services/news.service";

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  
  isLoading$: Observable<boolean>;
  news_list:any[] = [];
  constructor(private newsService:NewsService, private translationService: TranslationService, private router: Router, private activateRoute: ActivatedRoute, private subheader: SubheaderService, private applicationService:ApplicationService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.subheader.setTitle('CONSTRUCTOR.NEWS.TITLE');
    }, 1);    
  
    this.isLoading$ = new Observable<boolean>( observer => {
      observer.next(true);
      console.log("asdasdsad");
      this.newsService.getNewsList().then( res=>{
        console.log("news");
        console.log(res); 
        this.news_list = res;
        observer.next(false);
      });
      
    });      
  }

}
