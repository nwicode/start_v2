import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UsersRoutingModule} from './users-routing.module';
import {UsersComponent} from './users.component';
import {NgbDatepickerModule, NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {CRUDTableModule} from '../../platform/framework/shared/crud-table';
import {InlineSVGModule} from 'ng-inline-svg';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserDeleteComponent } from './user-delete/user-delete.component';
import { UsersDeleteComponent } from './users-delete/users-delete.component';
import {TranslateModule} from '@ngx-translate/core';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import {ToastService} from "../../platform/framework/core/services/toast.service";
import {CommonExtensions} from "../../platform/LayoutsComponents/CommonExtensions.module";

@NgModule({
    providers: [
        MatSnackBar,
        MatSnackBarModule,
        ToastService,

    ],    
    declarations: [UsersComponent, UserEditComponent, UserDeleteComponent, UsersDeleteComponent],
    imports: [
        CommonModule,
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        InlineSVGModule,
        CRUDTableModule,
        NgbModalModule,
        NgbDatepickerModule,
        CommonExtensions,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,        
        UsersRoutingModule
    ]
})
export class UsersModule {
}
