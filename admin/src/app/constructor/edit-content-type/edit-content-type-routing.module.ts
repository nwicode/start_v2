import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EditContentTypeComponent} from "./edit-content-type.component";

const routes: Routes = [
  {
    path: '',
    component: EditContentTypeComponent,
    children : [
      { path: '**', redirectTo: 'error/404' },
    ]
   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditContentTypeRoutingModule { }
