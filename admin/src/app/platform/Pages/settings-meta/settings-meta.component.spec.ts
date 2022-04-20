import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsMetaComponent } from './settings-meta.component';

describe('SettingsMetaComponent', () => {
  let component: SettingsMetaComponent;
  let fixture: ComponentFixture<SettingsMetaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingsMetaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsMetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
