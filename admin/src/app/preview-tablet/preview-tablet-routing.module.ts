import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PreviewTabletComponent} from "./preview-tablet.component";

const routes: Routes = [
{
  path: '',
  component: PreviewTabletComponent,
}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreviewTabletRoutingModule { }
