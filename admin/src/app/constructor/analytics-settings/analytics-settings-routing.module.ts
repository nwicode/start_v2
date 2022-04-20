import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AnalyticsSettingsComponent} from './analytics-settings.component';

const routes: Routes = [
    {
        path: '',
        component: AnalyticsSettingsComponent,
        children: []
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalyticsSettingsRoutingModule { }
