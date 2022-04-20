import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SettingsMetaComponent} from './settings-meta.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsMetaComponent,
  },  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsMetaRoutingModule { }
