import { TestBed } from '@angular/core/testing';

import { StringDialogService } from './string-dialog.service';

describe('StringDialogService', () => {
  let service: StringDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StringDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
