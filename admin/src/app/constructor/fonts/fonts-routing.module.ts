import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {FontsComponent} from "./fonts.component";
import {CustomFontComponent} from "./custom-font/custom-font.component";
const routes: Routes = [
    {
        path: '',
        component: FontsComponent
    },
    {
        path: 'custom-font',
        component: CustomFontComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FontsRoutingModule { }
