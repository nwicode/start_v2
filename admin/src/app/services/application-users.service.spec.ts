import { TestBed } from '@angular/core/testing';

import { ApplicationUsersService } from './application-users.service';

describe('ApplicationUsersService', () => {
  let service: ApplicationUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplicationUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
