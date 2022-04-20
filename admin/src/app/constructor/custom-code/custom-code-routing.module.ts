import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CustomCodeComponent} from "./custom-code.component";
import {CustomCodeEditorComponent} from "./custom-code-editor/custom-code-editor.component";

const routes: Routes = [
  {
    path: '',
    component: CustomCodeComponent,
    children : [
      {
        path: 'page/:page_id',
        component: CustomCodeEditorComponent
      },
      { path: '**', redirectTo: 'error/404' },
    ]
   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomCodeRoutingModule { }
