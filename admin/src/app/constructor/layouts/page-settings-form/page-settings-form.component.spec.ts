import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSettingsFormComponent } from './page-settings-form.component';

describe('PageSettingsFormComponent', () => {
  let component: PageSettingsFormComponent;
  let fixture: ComponentFixture<PageSettingsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageSettingsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageSettingsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
