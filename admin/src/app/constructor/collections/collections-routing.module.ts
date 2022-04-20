import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CollectionsComponent} from "./collections.component";
import {CollectionsListComponent} from "./collections-list/collections-list.component";
import {EditCollectionComponent} from "./edit-collection/edit-collection.component";
import {EditRecordComponent} from "./edit-record/edit-record.component";
import {RecordsListComponent} from "./records-list/records-list.component";

const routes: Routes = [
  {
    path: '',
    component: CollectionsComponent,
    children : [
      {
        path: 'collections-list',
        component: CollectionsListComponent,
      },
      {
        path: 'collection-edit/:collection_id',
        component: EditCollectionComponent,
      },
      {
        path: 'record-edit/:collection_id/:record_id',
        component: EditRecordComponent,
      },
      {
        path: 'record-list/:collection_id',
        component: RecordsListComponent,
      },
      { path: '', redirectTo: 'collections-list', pathMatch: 'full' },
      { path: '**', redirectTo: 'collections-list', pathMatch: 'full' },
    ]    
  },  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollectionsRoutingModule { }
