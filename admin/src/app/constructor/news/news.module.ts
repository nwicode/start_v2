import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NewsComponent} from './news.component'
import { NewsRoutingModule } from './news-routing.module';
import {InlineSVGModule} from 'ng-inline-svg';
import {TranslateModule} from '@ngx-translate/core';


@NgModule({
  providers: [
],   
  declarations: [NewsComponent],
  imports: [
    CommonModule,
    InlineSVGModule,
    TranslateModule,
    NewsRoutingModule
  ]
})
export class NewsModule { }
