import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplicationMenuComponent } from './application-menu.component';
const routes: Routes = [
  {
      path: '',
      component: ApplicationMenuComponent
  },
];;

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationMenuRoutingModule { }
