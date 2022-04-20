import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ContentTypeListComponent} from "./content-type-list.component";

const routes: Routes = [
  {
    path: '',
    component: ContentTypeListComponent,
    children : [
      { path: '**', redirectTo: 'error/404' },
    ]
   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentTypeListRoutingModule { }
