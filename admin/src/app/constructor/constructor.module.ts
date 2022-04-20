import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConstructorRoutingModule } from './constructor-routing.module';
import { ConstructorComponent } from './constructor.component';
import {
  NgbDropdownModule,
  NgbProgressbarModule,
  NgbPopoverModule,
  NgbModule ,
} from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';
import { CoreModule } from '../platform/framework/core';


import { ExtrasModule } from '../platform/framework/partials/layout/extras/extras.module';

//We user other subheader service on constructor route
import { SubheaderModule } from './ConstructorComponents/subheader/subheader.module';
import {TranslationModule} from '../modules/i18n/translation.module';
import {AsideComponent} from "./ConstructorComponents/aside-menu/aside/aside.component";
import {AsideDynamicComponent} from "./ConstructorComponents/aside-menu/aside-dynamic/aside-dynamic.component";

// load components from loader module
import {ComponentsModule} from '../ComponentsModule';
//import { PreviewLayerComponent } from './ConstructorComponents/preview-layer/preview-layer.component';
//import { IonicDialogComponent } from './ConstructorComponents/ionic-dialog/ionic-dialog.component';
//import { ColorDialogComponent } from '../platform/LayoutsComponents/color-dialog/color-dialog.component';
//import { BackgroundComponent } from './background/background.component';
//import { AndroidMockupComponent } from './ConstructorComponents/android-mockup/android-mockup.component';
import { PreviewLayerComponent } from './ConstructorComponents/preview-layer/preview-layer.component';


@NgModule({
  declarations: [
    ConstructorComponent,
    AsideComponent,
    AsideDynamicComponent,
    PreviewLayerComponent,
   //PreviewLayerComponent,
    //IonicDialogComponent,
    //ColorDialogComponent,
  ],
  imports: [
    CommonModule,
    ConstructorRoutingModule,
    InlineSVGModule,
    CoreModule,
    ExtrasModule,
    NgbDropdownModule,
    NgbProgressbarModule, 
    NgbPopoverModule, 
    NgbModule , 
    SubheaderModule, 
    TranslationModule,
    ComponentsModule
  ]
})
export class ConstructorModule { }
