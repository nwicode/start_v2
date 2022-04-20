import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbDropdownModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {InlineSVGModule} from 'ng-inline-svg';
import {ImageCropperModule} from 'ngx-image-cropper';


import {TranslateModule} from '@ngx-translate/core';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {ToastService} from '../../framework/core/services/toast.service';
import {CommonExtensions} from '../../LayoutsComponents/CommonExtensions.module';
import {EditUserComponent} from './edit-user.component';
import {PersonalInformationComponent} from "./personal-information/personal-information.component";
import {AccountInformationComponent} from "./account-information/account-information.component";
import {ChangePasswordComponent} from "./change-password/change-password.component";
import {EditUserRoutingModule} from "./edit-user-routing.module";
import {ModalPredefinedAvatarsModule} from "../../LayoutsComponents/modal-predefined-avatars/modal-predefined-avatars.module";
import { ApplicationsComponent } from './applications/applications.component';
import { ManagersComponent } from './managers/managers.component';



@NgModule({
    providers: [
        MatSnackBar,
        MatSnackBarModule,
        ToastService
    ],
    declarations: [
        EditUserComponent,
        PersonalInformationComponent,
        AccountInformationComponent,
        ChangePasswordComponent,
        ApplicationsComponent,
        ManagersComponent
    ],
    imports: [
        ImageCropperModule,
        CommonModule,
        CommonExtensions,
        NgbDropdownModule,
        NgbTooltipModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        InlineSVGModule,
        TranslateModule,
        MatSnackBarModule,
        EditUserRoutingModule,
        ModalPredefinedAvatarsModule
    ]
})
export class EditUserModule { }
