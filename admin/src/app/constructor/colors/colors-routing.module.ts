import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ColorsComponent} from './colors.component';
import {MainColorsComponent} from './main-colors/main-colors.component';
import {SystemColorComponent} from './system-color/system-color.component';
import {UserColorComponent} from './user-color/user-color.component';
import { AdditionalColorComponent } from './additional-color/additional-color.component';

const routes: Routes = [
  {
    path: '',
    component: ColorsComponent,
    children : [
      {
        path: 'main-color',
        component: MainColorsComponent
      },
      {
        path: 'system-color',
        component: SystemColorComponent
      }, 
      {
        path: 'user-color',
        component: UserColorComponent
      }, 
      {
        path: 'additional-color',
        component: AdditionalColorComponent
      }, 
      {
        path: '',
        redirectTo: 'main-color',
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
export class ColorsRoutingModule { }
