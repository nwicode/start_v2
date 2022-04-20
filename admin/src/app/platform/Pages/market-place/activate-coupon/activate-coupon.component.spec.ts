import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivateCouponComponent } from './activate-coupon.component';

describe('ActivateCouponComponent', () => {
  let component: ActivateCouponComponent;
  let fixture: ComponentFixture<ActivateCouponComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivateCouponComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivateCouponComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
