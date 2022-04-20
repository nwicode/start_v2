import { TestBed } from '@angular/core/testing';

import { UserReferralsService } from './user-referrals.service';

describe('UserReferralsService', () => {
  let service: UserReferralsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserReferralsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
