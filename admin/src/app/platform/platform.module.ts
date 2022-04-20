import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PlatformRoutingModule} from './platform-routing.module';
import {
    NgbDropdownModule,
    NgbProgressbarModule,
} from '@ng-bootstrap/ng-bootstrap';
import {InlineSVGModule} from 'ng-inline-svg';
import {CoreModule} from '../platform/framework/core';

import {PlatformComponent} from './platform.component';
import {ExtrasModule} from '../platform/framework/partials/layout/extras/extras.module';
import {SubheaderModule} from './LayoutsComponents/subheader/subheader.module';
import {TranslationModule} from '../modules/i18n/translation.module';
import {EditAppComponent} from './Pages/edit-app/edit-app.component';
import {SettingsSmtpComponent} from './Pages/settings-smtp/settings-smtp.component';

// load components from loader module
import {ComponentsModule} from '../ComponentsModule';




@NgModule({
    declarations: [
        PlatformComponent,
        EditAppComponent,
    ],

    imports: [
        CommonModule,
        PlatformRoutingModule,
        InlineSVGModule,
        CoreModule,
        ExtrasModule,
        NgbDropdownModule,
        NgbProgressbarModule,
        SubheaderModule,
        TranslationModule,
        ComponentsModule
    ],
})
export class PlatformModule {
}
