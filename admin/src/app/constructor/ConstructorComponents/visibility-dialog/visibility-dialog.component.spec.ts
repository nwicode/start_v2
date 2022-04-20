import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisibilityDialogComponent } from './visibility-dialog.component';

describe('VisibilityDialogComponent', () => {
  let component: VisibilityDialogComponent;
  let fixture: ComponentFixture<VisibilityDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisibilityDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisibilityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
