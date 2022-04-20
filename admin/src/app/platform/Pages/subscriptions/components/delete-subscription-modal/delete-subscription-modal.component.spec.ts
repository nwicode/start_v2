import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSubscriptionModalComponent } from './delete-subscription-modal.component';

describe('DeleteSubscriptionModalComponent', () => {
  let component: DeleteSubscriptionModalComponent;
  let fixture: ComponentFixture<DeleteSubscriptionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteSubscriptionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteSubscriptionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
