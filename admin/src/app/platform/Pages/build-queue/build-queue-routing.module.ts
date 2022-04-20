import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BuildQueueComponent} from "./build-queue.component";

const routes: Routes = [
    {
        path: '',
        component: BuildQueueComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BuildQueueRoutingModule { }
