import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelSubscriptionModalComponent } from './cancel-subscription-modal.component';

describe('CancelSubscriptionModalComponent', () => {
  let component: CancelSubscriptionModalComponent;
  let fixture: ComponentFixture<CancelSubscriptionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelSubscriptionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelSubscriptionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
