import { TestBed } from '@angular/core/testing';

import { UserWithdrawalsService } from './user-withdrawals.service';

describe('UserWithdrawalsService', () => {
  let service: UserWithdrawalsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserWithdrawalsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
