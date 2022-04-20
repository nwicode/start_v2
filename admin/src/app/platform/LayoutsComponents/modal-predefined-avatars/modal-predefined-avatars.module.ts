import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ModalPredefinedAvatarsComponent} from "./modal-predefined-avatars.component";
import {TranslateModule} from "@ngx-translate/core";


@NgModule({
    declarations: [ModalPredefinedAvatarsComponent],
    imports: [
        CommonModule,
        TranslateModule
    ],
    exports: [ModalPredefinedAvatarsComponent]
})
export class ModalPredefinedAvatarsModule { }