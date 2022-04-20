import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SettingsWithdrawalsComponent} from './settings-withdrawals.component';

const routes: Routes = [
    {
        path: '',
        component: SettingsWithdrawalsComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SettingsWithdrawalsRoutingModule {
}
