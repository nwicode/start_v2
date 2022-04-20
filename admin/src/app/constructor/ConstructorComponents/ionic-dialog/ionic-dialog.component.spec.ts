import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IonicDialogComponent } from './ionic-dialog.component';

describe('IonicDialogComponent', () => {
  let component: IonicDialogComponent;
  let fixture: ComponentFixture<IonicDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IonicDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IonicDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
