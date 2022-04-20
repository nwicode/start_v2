import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsSettingsComponent } from './analytics-settings.component';

describe('AnalyticsSettingsComponent', () => {
  let component: AnalyticsSettingsComponent;
  let fixture: ComponentFixture<AnalyticsSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalyticsSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
