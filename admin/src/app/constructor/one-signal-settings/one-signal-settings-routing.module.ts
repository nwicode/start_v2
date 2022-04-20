import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {OneSignalSettingsComponent} from "./one-signal-settings.component";
const routes: Routes = [
    {
        path: '',
        component: OneSignalSettingsComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OneSignalSettingsRoutingModule { }
