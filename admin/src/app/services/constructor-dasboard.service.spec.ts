import { TestBed } from '@angular/core/testing';

import { ConstructorDasboardService } from './constructor-dasboard.service';

describe('ConstructorDasboardService', () => {
  let service: ConstructorDasboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConstructorDasboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
