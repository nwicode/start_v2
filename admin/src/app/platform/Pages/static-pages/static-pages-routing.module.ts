import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StaticPagesComponent } from './static-pages.component';
import { StaticPageEditorComponent } from './static-page-editor/static-page-editor.component';

const routes: Routes = [
    {
        path: '',
        component: StaticPagesComponent,
        children : [
            { path: ':code', component: StaticPageEditorComponent },
            { path: '**', redirectTo: '', pathMatch: 'full' }
        ]
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StaticPagesRoutingModule { }
