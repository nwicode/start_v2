import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {UserPageComponent} from './user-page.component';

import {PersonalInformationComponent} from './personal-information/personal-information.component';
import {AccountInformationComponent} from './account-information/account-information.component';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {ChangeTarifComponent} from './change-tarif/change-tarif.component';
import {ReferralsComponent} from './referrals/referrals.component';
import {WithdrawalsComponent} from './withdrawals/withdrawals.component';
import {AddWithdrawalRequestComponent} from "./withdrawals/add-withdrawal-request/add-withdrawal-request.component";

const routes: Routes = [
    {
        path: '',
        component: UserPageComponent,
        children: [
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
                path: 'change-tarif',
                component: ChangeTarifComponent
            },
            {
                path: 'referrals',
                component: ReferralsComponent
            },
            {
                path: 'withdrawals',
                component: WithdrawalsComponent
            },
            {
                path: 'add-withdrawal',
                component: AddWithdrawalRequestComponent
            },
            {path: '', redirectTo: 'personal-information', pathMatch: 'full'},
            {path: '**', redirectTo: 'profile-overview', pathMatch: 'full'},
        ]
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserPageRoutingModule {
}
