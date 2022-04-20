import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {PersonalInformationComponent} from './personal-information/personal-information.component';
import {AccountInformationComponent} from './account-information/account-information.component';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {EditUserComponent} from "./edit-user.component";
import { ApplicationsComponent } from './applications/applications.component';
import {ManagersComponent} from "./managers/managers.component";

const routes: Routes = [
    {
        path: '',
        component: EditUserComponent,
        children : [
            {
                path: 'personal-information',
                component: PersonalInformationComponent,
            },
            {
                path: 'account-information',
                component: AccountInformationComponent
            },
            {
                path: 'change-password',
                component: ChangePasswordComponent
            },
            {
                path: 'applications',
                component: ApplicationsComponent
            },

            {
                path: 'managers',
                component: ManagersComponent
            },
            { path: '', redirectTo: 'personal-information', pathMatch: 'full' },
            { path: '**', redirectTo: 'personal-information', pathMatch: 'full' },
        ]
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EditUserRoutingModule { }
