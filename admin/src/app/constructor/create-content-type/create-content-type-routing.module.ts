import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CreateContentTypeComponent} from "./create-content-type.component";

const routes: Routes = [
  {
    path: '',
    component: CreateContentTypeComponent,
    children : [
      { path: '**', redirectTo: 'error/404' },
    ]
   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateContentTypeRoutingModule { }
