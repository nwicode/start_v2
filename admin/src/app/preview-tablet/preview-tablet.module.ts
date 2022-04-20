import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreviewTabletRoutingModule } from './preview-tablet-routing.module';
import {TranslateModule} from '@ngx-translate/core';
import { PreviewTabletComponent } from './preview-tablet.component';

@NgModule({
  declarations: [PreviewTabletComponent],
  imports: [
    CommonModule,
    TranslateModule,
    PreviewTabletRoutingModule
  ]
})
export class PreviewTabletModule { }
