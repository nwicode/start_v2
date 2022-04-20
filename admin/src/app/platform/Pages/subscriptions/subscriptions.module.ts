import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SubscriptionsRoutingModule} from './subscriptions-routing.module';
import {SubscriptionsComponent} from './subscriptions.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InlineSVGModule} from 'ng-inline-svg';
import {CRUDTableModule} from '../../framework/shared/crud-table';
import {NgbDatepickerModule, NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {MatPaginatorModule} from '@angular/material/paginator';
import { DeleteSubscriptionModalComponent } from './components/delete-subscription-modal/delete-subscription-modal.component';
import { CancelSubscriptionModalComponent } from './components/cancel-subscription-modal/cancel-subscription-modal.component';


@NgModule({
    declarations: [SubscriptionsComponent, DeleteSubscriptionModalComponent, CancelSubscriptionModalComponent],
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        InlineSVGModule,
        CRUDTableModule,
        NgbModalModule,
        NgbDatepickerModule,
        MatPaginatorModule,
        SubscriptionsRoutingModule
    ]
})
export class SubscriptionsModule {
}
