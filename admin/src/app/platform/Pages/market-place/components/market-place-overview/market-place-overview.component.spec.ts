import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketPlaceOverviewComponent } from './market-place-overview.component';

describe('MarketPlaceOverviewComponent', () => {
  let component: MarketPlaceOverviewComponent;
  let fixture: ComponentFixture<MarketPlaceOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketPlaceOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketPlaceOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
