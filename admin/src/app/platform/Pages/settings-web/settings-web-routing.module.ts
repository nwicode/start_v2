import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SettingsWebComponent } from './settings-web.component';
const routes: Routes = [
  {
    path: '',
    component: SettingsWebComponent,
  },  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsWebRoutingModule { }
