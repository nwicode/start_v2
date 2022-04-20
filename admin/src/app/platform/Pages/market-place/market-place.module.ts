import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MarketPlaceRoutingModule} from './market-place-routing.module';
import {MarketPlaceComponent} from './market-place.component';
import {MarketPlaceOverviewComponent} from './components/market-place-overview/market-place-overview.component';
import {HttpClientModule} from '@angular/common/http';
import {CRUDTableModule} from '../../framework/shared/crud-table';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InlineSVGModule} from 'ng-inline-svg';
import {NgbDropdownModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {WidgetsModule} from '../../framework/partials/content/widgets/widgets.module';
import {DropdownMenusModule} from '../../LayoutsComponents/dropdown-menus/dropdown-menus.module';
import {AccountInformationComponent} from './account-information/account-information.component';
import {SolutionUpdateComponent} from './solution-update/solution-update.component';
import {InstalledSolutionsComponent} from './installed-solutions/installed-solutions.component';
import {PlatformUpdateComponent} from './platform-update/platform-update.component';
import {ActivateCouponComponent} from './activate-coupon/activate-coupon.component';
import {TranslateModule} from '@ngx-translate/core';


@NgModule({
    declarations: [MarketPlaceComponent, MarketPlaceOverviewComponent, AccountInformationComponent, SolutionUpdateComponent,
        InstalledSolutionsComponent, PlatformUpdateComponent,  ActivateCouponComponent,
        ],
    imports: [
        CommonModule,
        HttpClientModule,
        CRUDTableModule,
        FormsModule,
        ReactiveFormsModule,
        InlineSVGModule,
        DropdownMenusModule,
        NgbDropdownModule,
        NgbTooltipModule,
        WidgetsModule,
        TranslateModule,
        MarketPlaceRoutingModule
    ]
})
export class MarketPlaceModule {
}
