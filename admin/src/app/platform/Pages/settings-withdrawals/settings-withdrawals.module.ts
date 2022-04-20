import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SettingsWithdrawalsRoutingModule} from './settings-withdrawals-routing.module';
import {SettingsWithdrawalsComponent} from './settings-withdrawals.component';
import {ImageCropperModule} from 'ngx-image-cropper';
import {CommonExtensions} from '../../LayoutsComponents/CommonExtensions.module';
import {NgbDropdownModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UserPageRoutingModule} from '../user-page/user-page-routing.module';
import {InlineSVGModule} from 'ng-inline-svg';
import {TranslateModule} from '@ngx-translate/core';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';
import {StripeBillingModule} from '../../../modules/stripe-billing/stripe-billing.module';
import {ModalPredefinedAvatarsModule} from '../../LayoutsComponents/modal-predefined-avatars/modal-predefined-avatars.module';


@NgModule({
    declarations: [SettingsWithdrawalsComponent],
    imports: [
        CommonModule,
        SettingsWithdrawalsRoutingModule,
        ImageCropperModule,
        CommonExtensions,
        NgbDropdownModule,
        NgbTooltipModule,
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        UserPageRoutingModule,
        InlineSVGModule,
        TranslateModule,
        MatSnackBarModule,
        MatDialogModule,
        StripeBillingModule,
        ModalPredefinedAvatarsModule
    ]
})
export class SettingsWithdrawalsModule {
}
