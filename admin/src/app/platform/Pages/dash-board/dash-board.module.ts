import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashBoardComponent } from './dash-board.component';
import { DashBoardRoutingModule } from './dash-board-routing.module';
import {TranslateModule} from '@ngx-translate/core';
import {InlineSVGModule} from 'ng-inline-svg';
import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
  providers: [
    NgApexchartsModule,
  ],   
  declarations: [DashBoardComponent],
  imports: [
    CommonModule,
    NgApexchartsModule,
    DashBoardRoutingModule,
    TranslateModule,
    InlineSVGModule,
  ]
})
export class DashBoardModule { }
