import { Injectable, EventEmitter } from '@angular/core';
import {PaginatedSubscriptions, Subscription} from '../platform/Pages/subscriptions/subscriptions.objects';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
    public PaginatedSubscriptionListEmitter = new EventEmitter<PaginatedSubscriptions>();
    public SubscriptionsListEmitter = new EventEmitter<Subscription[]>();
  constructor() { }
}
