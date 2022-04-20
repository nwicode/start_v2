import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserColorComponent } from './user-color.component';

describe('UserColorComponent', () => {
  let component: UserColorComponent;
  let fixture: ComponentFixture<UserColorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserColorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
