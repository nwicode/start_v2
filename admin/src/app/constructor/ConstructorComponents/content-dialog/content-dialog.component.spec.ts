import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentDialogComponent } from './content-dialog.component';

describe('ContentDialogComponent', () => {
  let component: ContentDialogComponent;
  let fixture: ComponentFixture<ContentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
