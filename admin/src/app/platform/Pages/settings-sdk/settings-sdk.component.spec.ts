import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsSdkComponent } from './settings-sdk.component';

describe('SettingsSdkComponent', () => {
  let component: SettingsSdkComponent;
  let fixture: ComponentFixture<SettingsSdkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingsSdkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsSdkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
