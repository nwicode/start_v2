import { TestBed } from '@angular/core/testing';

import { ReferralProgramsService } from './referral-programs.service';

describe('ReferralProgramsService', () => {
  let service: ReferralProgramsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReferralProgramsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
