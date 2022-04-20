import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthLogoEditComponent } from './auth-logo-edit.component';

describe('AuthLogoEditComponent', () => {
  let component: AuthLogoEditComponent;
  let fixture: ComponentFixture<AuthLogoEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthLogoEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthLogoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
