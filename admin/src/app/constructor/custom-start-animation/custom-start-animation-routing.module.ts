import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CustomStartAnimationComponent} from "./custom-start-animation.component";

const routes: Routes = [
    {
        path: '',
        component: CustomStartAnimationComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CustomStartAnimationRoutingModule { }
