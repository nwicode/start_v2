import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PreviewComponent} from "./preview.component";
import { PreviewRoutingModule } from './preview-routing.module';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [PreviewComponent],
  imports: [
    CommonModule,
    TranslateModule,
    PreviewRoutingModule
  ]
})
export class PreviewModule { }
