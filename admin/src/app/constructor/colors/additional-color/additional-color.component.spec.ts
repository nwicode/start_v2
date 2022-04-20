import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalColorComponent } from './additional-color.component';

describe('AdditionalColorComponent', () => {
  let component: AdditionalColorComponent;
  let fixture: ComponentFixture<AdditionalColorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdditionalColorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
