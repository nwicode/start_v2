import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EditorCssComponent} from "./editor-css.component";
const routes: Routes = [
    {
        path: '',
        component: EditorCssComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EditorCssRoutingModule { }
