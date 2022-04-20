import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdmobSettingsComponent } from './admob-settings.component';
const routes: Routes = [
    {
        path: '',
        component: AdmobSettingsComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdmobSettingsRoutingModule { }
