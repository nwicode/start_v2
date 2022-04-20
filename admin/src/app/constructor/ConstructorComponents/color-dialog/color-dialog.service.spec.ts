import { TestBed } from '@angular/core/testing';

import { ColorDialogService } from './color-dialog.service';

describe('ColorDialogService', () => {
  let service: ColorDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColorDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
