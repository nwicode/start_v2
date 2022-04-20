import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsAssetsComponent } from './settings-assets.component';

describe('SettingsAssetsComponent', () => {
  let component: SettingsAssetsComponent;
  let fixture: ComponentFixture<SettingsAssetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingsAssetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
