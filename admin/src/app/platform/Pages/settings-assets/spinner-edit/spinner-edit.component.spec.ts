import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinnerEditComponent } from './spinner-edit.component';

describe('SpinnerEditComponent', () => {
  let component: SpinnerEditComponent;
  let fixture: ComponentFixture<SpinnerEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpinnerEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinnerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
