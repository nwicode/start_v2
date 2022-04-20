import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageUploaderComponent } from './image-uploader/image-uploader.component';
import {TranslateModule} from '@ngx-translate/core';
import { base64ToFile, Dimensions, ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import { ColorSketchModule } from 'ngx-color/sketch';
import { FormsModule } from '@angular/forms';  // <<<< import it here
import {IoniconDialogModule} from '../../modules/ionicon-dialog/ionicon-dialog.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    ImageCropperModule,
    ColorSketchModule,
    IoniconDialogModule,
    FormsModule,
  ],
  declarations: [
    ImageUploaderComponent,
    ColorPickerComponent,
  ],
  exports: [
    ImageUploaderComponent,
    ColorPickerComponent,
  ]
})
export class CommonExtensions { }