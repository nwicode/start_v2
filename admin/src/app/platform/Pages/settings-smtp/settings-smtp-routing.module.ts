import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SettingsSmtpComponent } from './settings-smtp.component';
const routes: Routes = [
  {
    path: '',
    component: SettingsSmtpComponent,
  },  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsSmtpRoutingModule { }
