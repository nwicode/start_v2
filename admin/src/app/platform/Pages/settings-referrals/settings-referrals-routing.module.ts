import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SettingsReferralsComponent} from './settings-referrals.component';
import {AddReferralProgramComponent} from './add-referral-program/add-referral-program.component';
import {UpdateReferralProgramComponent} from './update-referral-program/update-referral-program.component';

const routes: Routes = [
    {
        path: 'referral-programs',
        component: SettingsReferralsComponent,
    },
    {
        path: 'add-referral-programs',
        component: AddReferralProgramComponent,
    },
    {
        path: 'update-referral-programs/:id',
        component: UpdateReferralProgramComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SettingsReferralsRoutingModule {
}
