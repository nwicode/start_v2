import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsSmtpComponent } from './settings-smtp.component';

describe('SettingsSmtpComponent', () => {
  let component: SettingsSmtpComponent;
  let fixture: ComponentFixture<SettingsSmtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingsSmtpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsSmtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
