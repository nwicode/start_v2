import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ColorPickerComponent} from './color-picker.component';
import { ColorSketchModule } from 'ngx-color/sketch';

@NgModule({
  declarations: [ColorPickerComponent],
  imports: [
    CommonModule,
    ColorSketchModule
  ]
})
export class ColorPickerModule { }
