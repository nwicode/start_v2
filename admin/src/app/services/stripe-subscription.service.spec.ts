import { TestBed } from '@angular/core/testing';

import { StripeSubscriptionService } from './stripe-subscription.service';

describe('StripeSubscriptionService', () => {
  let service: StripeSubscriptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StripeSubscriptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
