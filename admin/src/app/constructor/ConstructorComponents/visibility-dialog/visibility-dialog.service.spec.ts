import { TestBed } from '@angular/core/testing';

import { VisibilityDialogService } from './visibility-dialog.service';

describe('VisibilityDialogService', () => {
  let service: VisibilityDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VisibilityDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
