import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserPageRoutingModule } from './user-page-routing.module';
import {NgbDropdownModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {InlineSVGModule} from 'ng-inline-svg';
import {UserPageComponent} from './user-page.component';
import { ImageCropperModule } from 'ngx-image-cropper';


import {PersonalInformationComponent} from './personal-information/personal-information.component';
import {AccountInformationComponent} from './account-information/account-information.component';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {TranslateModule} from '@ngx-translate/core';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {ToastService} from '../../framework/core/services/toast.service';
//import { ImageUploaderComponent } from '../../LayoutsComponents/image-uploader/image-uploader.component';
import {CommonExtensions} from '../../LayoutsComponents/CommonExtensions.module';
import {ModalPredefinedAvatarsModule} from "../../LayoutsComponents/modal-predefined-avatars/modal-predefined-avatars.module";
import { ChangeTarifComponent } from './change-tarif/change-tarif.component';
import {StripeBillingModule} from '../../../modules/stripe-billing/stripe-billing.module';
import {MatDialogModule} from '@angular/material/dialog';
import { ReferralsComponent } from './referrals/referrals.component';
import { WithdrawalsComponent } from './withdrawals/withdrawals.component';
import { AddWithdrawalRequestComponent } from './withdrawals/add-withdrawal-request/add-withdrawal-request.component';
import {ClipboardModule} from "@angular/cdk/clipboard";



@NgModule({
  providers: [
    MatSnackBar,
    MatSnackBarModule,
    ToastService,
    
  ],
  declarations: [
    UserPageComponent,
    PersonalInformationComponent,
    AccountInformationComponent,
    ChangePasswordComponent,
    ChangeTarifComponent,
    ReferralsComponent,
    WithdrawalsComponent,
    AddWithdrawalRequestComponent
  ],
    imports: [
        ImageCropperModule,
        CommonModule,
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
        ClipboardModule,
        ModalPredefinedAvatarsModule
    ]
})
export class UserPageModule { }
