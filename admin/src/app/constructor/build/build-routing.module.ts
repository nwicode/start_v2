import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BuildComponent} from './build.component';

const routes: Routes = [
  {
    path: '',
    component: BuildComponent,
   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuildRoutingModule { }
