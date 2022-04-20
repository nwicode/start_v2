import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {MarketPlaceComponent} from './market-place.component';
import {AccountInformationComponent} from './account-information/account-information.component';
import {SolutionUpdateComponent} from './solution-update/solution-update.component';
import {PlatformUpdateComponent} from './platform-update/platform-update.component';
import {ActivateCouponComponent} from './activate-coupon/activate-coupon.component';
import {InstalledSolutionsComponent} from './installed-solutions/installed-solutions.component';

const routes: Routes = [
    {
        path: '',
        component: MarketPlaceComponent,
        children: [
            {
                path: 'account-information',
                component: AccountInformationComponent,
            },
            {
                path: 'activate-coupon',
                component: ActivateCouponComponent,
            },
            {
                path: 'solution-update',
                component: SolutionUpdateComponent,
            },
            {
                path: 'installed-solutions',
                component: InstalledSolutionsComponent,
            },
            {
                path: 'platform-update',
                component: PlatformUpdateComponent,
            },
            { path: '', redirectTo: 'license-information', pathMatch: 'full' },
            { path: '**', redirectTo: 'license-information', pathMatch: 'full' },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MarketPlaceRoutingModule {
}
