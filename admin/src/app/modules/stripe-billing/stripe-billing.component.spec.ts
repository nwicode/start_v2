import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StripeBillingComponent } from './stripe-billing.component';

describe('StripeBillingComponent', () => {
  let component: StripeBillingComponent;
  let fixture: ComponentFixture<StripeBillingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StripeBillingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StripeBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
