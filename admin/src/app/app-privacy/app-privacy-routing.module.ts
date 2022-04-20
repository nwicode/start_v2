import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AppPrivacyComponent} from "./app-privacy.component";

const routes: Routes = [
    {
        path: '',
        component: AppPrivacyComponent,
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AppPrivacyRoutingModule { }
