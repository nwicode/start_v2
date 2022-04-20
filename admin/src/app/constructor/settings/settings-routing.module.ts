import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SettingsComponent} from "./settings.component";
import {IconEditComponent} from "./icon-edit/icon-edit.component";
import {SplashScreenEditComponent} from "./splash-screen-edit/splash-screen-edit.component";
import {AppSettingsComponent} from "./app-settings/app-settings.component";
import {PrivacyComponent} from "./privacy/privacy.component";

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children : [
      {
        path: 'icon-edit',
        component: IconEditComponent
      },
      {
        path: 'splashscreen',
        component: SplashScreenEditComponent
      }, 
      {
        path: 'app-settings',
        component: AppSettingsComponent
      },
      {
        path: 'privacy',
        component: PrivacyComponent
      },
      {
        path: '',
        redirectTo: 'app-settings',
        pathMatch: 'full'
      },
      { path: '**', redirectTo: 'error/404' },  
    ]    
   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
