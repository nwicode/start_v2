import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SettingsReferralsRoutingModule} from './settings-referrals-routing.module';
import {SettingsReferralsComponent} from './settings-referrals.component';
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
import { AddReferralProgramComponent } from './add-referral-program/add-referral-program.component';
import { UpdateReferralProgramComponent } from './update-referral-program/update-referral-program.component';


@NgModule({
    declarations: [SettingsReferralsComponent, AddReferralProgramComponent, UpdateReferralProgramComponent],
    imports: [
        CommonModule,
        SettingsReferralsRoutingModule,
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
export class SettingsReferralsModule {
}
