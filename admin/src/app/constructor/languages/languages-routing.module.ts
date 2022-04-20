import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LanguagesComponent} from './languages.component';

const routes: Routes = [
  {
      path: '',
      component: LanguagesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LanguagesRoutingModule { }
