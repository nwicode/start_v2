import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplicationTranslationsComponent } from './application-translations.component';
const routes: Routes = [
  {
      path: '',
      component: ApplicationTranslationsComponent
  },
];;

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationTranslationsRoutingModule { }
