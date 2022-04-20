import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LanguagesComponent } from './languages.component';
import { DefaultComponent } from './default/default.component';
import { AddLanguageComponent } from './add-language/add-language.component';
import { UploadLanguageComponent } from './upload-language/upload-language.component';
import { ManageComponent } from './manage/manage.component';

const routes: Routes = [
  {
   path: '',
   component: LanguagesComponent,
   children : [
    {
      path: 'default',
      component: DefaultComponent,
    }, 
    {
      path: 'add-language',
      component: AddLanguageComponent,
    }, 
    {
      path: 'upload-language',
      component: UploadLanguageComponent,
    },
    {
      path: 'manage',
      component: ManageComponent,
    },
     { path: '', redirectTo: 'default', pathMatch: 'full' },
     { path: '**', redirectTo: 'default', pathMatch: 'full' },
   ]
  }
   
 ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LanguagesRoutingModule { }
