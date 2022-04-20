/**
 * Common components module
 * load all components on this file
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//Modules
import { InlineSVGModule } from 'ng-inline-svg';
import {TranslationModule} from './modules/i18n/translation.module';
import { SubheaderModule } from './platform/LayoutsComponents/subheader/subheader.module';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule, NgbProgressbarModule, } from '@ng-bootstrap/ng-bootstrap';
import { ExtrasModule } from './platform/framework/partials/layout/extras/extras.module';
import { CoreModule } from './platform/framework/core';

//Components
import { FooterComponent } from './platform/LayoutsComponents/footer/footer.component';
import { ThemeSwitcherComponent } from './platform/LayoutsComponents/theme-switcher/theme-switcher.component';
import { NotificationsOffcanvasComponent } from './platform/LayoutsComponents/notifications-offcanvas/notifications-offcanvas.component';
import { NotificationsDropdownInnerComponent } from './platform/LayoutsComponents/notifications-dropdown-inner/notifications-dropdown-inner.component';
import { UserDropdownInnerComponent } from './platform/LayoutsComponents/user-dropdown-inner/user-dropdown-inner.component';
import { ScriptsInitComponent } from './platform/LayoutsComponents/scipts-init/scripts-init.component';
import { AsideComponent } from './platform/LayoutsComponents/aside/aside.component';
import { AsideDynamicComponent } from './platform/LayoutsComponents/aside-dynamic/aside-dynamic.component';
import { LanguageSelectorComponent } from './platform/LayoutsComponents/language-selector/language-selector.component';
import { HeaderMobileComponent } from './platform/LayoutsComponents/header-mobile/header-mobile.component';
import { HeaderComponent } from './platform/LayoutsComponents/header/header.component';
import { TopbarComponent } from './platform/LayoutsComponents/topbar/topbar.component';
import { ColorDialogComponent } from './constructor/ConstructorComponents/color-dialog/color-dialog.component';
import { IonicDialogComponent } from './constructor/ConstructorComponents/ionic-dialog/ionic-dialog.component';
import {MatTabsModule} from "@angular/material/tabs";
import {MatCommonModule} from '@angular/material/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';  // <<<< import it here
import {AngularSvgIconModule} from 'angular-svg-icon';
import {StringDialogComponent} from "./constructor/ConstructorComponents/string-dialog/string-dialog.component";
import {TextDialogComponent} from "./constructor/ConstructorComponents/text-dialog/text-dialog.component";
import {CKEditorModule} from "ckeditor4-angular";
import {VisibilityDialogComponent} from "./constructor/ConstructorComponents/visibility-dialog/visibility-dialog.component";
import {ContentDialogComponent} from "./constructor/ConstructorComponents/content-dialog/content-dialog.component";
//import { PreviewLayerComponent } from './constructor/ConstructorComponents/preview-layer/preview-layer.component';
@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        InlineSVGModule,
        TranslationModule,
        SubheaderModule,
        NgbDropdownModule,
        NgbProgressbarModule,
        MatCommonModule,
        ExtrasModule,
        CoreModule,
        MatTabsModule,
        FormsModule,
        AngularSvgIconModule,
        ReactiveFormsModule,
        CKEditorModule,

    ],
    declarations: [
        FooterComponent,
        ThemeSwitcherComponent,
        NotificationsOffcanvasComponent,
        NotificationsDropdownInnerComponent,
        UserDropdownInnerComponent,
        ScriptsInitComponent,
        AsideComponent,
        AsideDynamicComponent,
        LanguageSelectorComponent,
        HeaderMobileComponent,
        HeaderComponent,
        TopbarComponent,
        ColorDialogComponent,
        IonicDialogComponent,
        StringDialogComponent,
        TextDialogComponent,
        VisibilityDialogComponent,
        //PreviewLayerComponent,
        ContentDialogComponent
    ],
    exports: [
        TranslationModule,
        FooterComponent,
        ThemeSwitcherComponent,
        NotificationsOffcanvasComponent,
        NotificationsDropdownInnerComponent,
        UserDropdownInnerComponent,
        ScriptsInitComponent,
        AsideComponent, 
        AsideDynamicComponent,
        LanguageSelectorComponent,
        HeaderMobileComponent,
        HeaderComponent,
        TopbarComponent,
        MatTabsModule,
        FormsModule,
        AngularSvgIconModule,
        ColorDialogComponent,
        IonicDialogComponent,
        StringDialogComponent,
        TextDialogComponent,
        VisibilityDialogComponent,
        //PreviewLayerComponent,
        ContentDialogComponent
    ],
    providers: []
})
export class ComponentsModule {
}
