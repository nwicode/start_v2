import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MixPanelSettingsComponent} from "./mix-panel-settings.component";
const routes: Routes = [
    {
        path: '',
        component: MixPanelSettingsComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MixPanelSettingsRoutingModule { }
