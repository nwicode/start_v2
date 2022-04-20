import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ContentComponent} from "./content.component";
import {ContentListComponent} from "./content-list/content-list.component";
import {ContentEditComponent} from "./content-edit/content-edit.component";
const routes: Routes = [
    {
        path: '',
        component: ContentComponent,
        children : [
            {
                path: 'content-list/:content_type',
                component: ContentListComponent,
            },
            {
                path: 'content-edit/:content_type/:content_id',
                component: ContentEditComponent,
            },
            { path: '', redirectTo: 'error/404', pathMatch: 'full' },
            { path: '**', redirectTo: 'error/404' },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ContentRoutingModule { }
