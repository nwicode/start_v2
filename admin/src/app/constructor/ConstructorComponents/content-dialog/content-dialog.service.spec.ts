import { TestBed } from '@angular/core/testing';

import { ContentDialogService } from './content-dialog.service';

describe('ContentDialogService', () => {
  let service: ContentDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContentDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
