import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsAssetsComponent } from './settings-assets.component';
import { SpinnerEditComponent } from './spinner-edit/spinner-edit.component';
import { InnerLogoEditComponent } from './inner-logo-edit/inner-logo-edit.component';
import { BgImageEditComponent } from './bg-image-edit/bg-image-edit.component';
import { AuthLogoEditComponent } from './auth-logo-edit/auth-logo-edit.component';
import {FaviconEditComponent} from "./favicon-edit/favicon-edit.component";

const routes: Routes = [
  {
    path: '',
    component: SettingsAssetsComponent,
    children : [
      {
        path: 'spinner-edit',
        component: SpinnerEditComponent,
      },
      {
        path: 'inner-logo-edit',
        component: InnerLogoEditComponent,
      },
      {
        path: 'auth-background-image-edit',
        component: BgImageEditComponent,
      },
      {
        path: 'auth-logo-image-edit',
        component: AuthLogoEditComponent,
      },
      {
        path: 'favicon-edit',
        component: FaviconEditComponent,
      },
      { path: '', redirectTo: 'spinner-edit', pathMatch: 'full' },
      { path: '**', redirectTo: 'profile-overview', pathMatch: 'full' },
    ]
   }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsAssetsRoutingModule { }
