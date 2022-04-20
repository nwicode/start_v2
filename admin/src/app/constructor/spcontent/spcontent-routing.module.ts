import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SPContentComponent} from './spcontent.component';
import {ListComponent} from './list/list.component';
import {EditComponent} from './edit/edit.component';

const routes: Routes = [
  {
      path: '',
      component: SPContentComponent,
      children : [
        {
          path: 'list',
          component: ListComponent,
        }
        ,{
          path: 'edit/:product_iap_id',
          component: EditComponent,
        },
        { path: '', redirectTo: 'list', pathMatch: 'full' },
        { path: '**', redirectTo: 'list', pathMatch: 'full' },
      ]       
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SPContentRoutingModule { }
