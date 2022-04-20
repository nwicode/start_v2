import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsWebComponent } from './settings-web.component';

describe('SettingsWebComponent', () => {
  let component: SettingsWebComponent;
  let fixture: ComponentFixture<SettingsWebComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingsWebComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsWebComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
