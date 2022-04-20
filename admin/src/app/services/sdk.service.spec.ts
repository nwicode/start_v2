import { TestBed } from '@angular/core/testing';

import { SdkService } from './sdk.service';

describe('SdkService', () => {
  let service: SdkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SdkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
