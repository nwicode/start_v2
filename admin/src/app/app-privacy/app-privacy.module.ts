import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {AppPrivacyComponent} from "./app-privacy.component";
import {AppPrivacyRoutingModule} from "./app-privacy-routing.module";

@NgModule({
    declarations: [AppPrivacyComponent],
    imports: [
        CommonModule,
        TranslateModule,
        AppPrivacyRoutingModule
    ]
})
export class AppPrivacyModule { }
