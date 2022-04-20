import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PushMessagesComponent } from './push-messages.component';
import {TopicsComponent} from "./topics/topics.component";

const routes: Routes = [
    {
        path: '',
        component: PushMessagesComponent,
        children : [
            {
                path: 'topics',
                component: TopicsComponent,
            },
            { path: '', redirectTo: '', pathMatch: 'full' },
            { path: '**', redirectTo: '', pathMatch: 'full' },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PushMessagesRoutingModule { }
