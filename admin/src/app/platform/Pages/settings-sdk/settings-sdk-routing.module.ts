import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsSdkComponent} from './settings-sdk.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsSdkComponent,
  },  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsSdkRoutingModule { }
