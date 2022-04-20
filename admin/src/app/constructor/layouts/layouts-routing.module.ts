import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LayoutsComponent} from '../layouts/layouts.component';
import {ListComponent} from '../layouts/list/list.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutsComponent,
    children : [
      {
        path: 'list',
        component: ListComponent,
      },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: '**', redirectTo: 'list', pathMatch: 'full' },
    ]    
   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutsRoutingModule { }
