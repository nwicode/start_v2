import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {FirebaseSettingsComponent} from "./firebase-settings.component";
const routes: Routes = [
    {
        path: '',
        component: FirebaseSettingsComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FirebaseSettingsRoutingModule { }
