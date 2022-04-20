import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationTranslationsComponent } from './application-translations.component';

describe('ApplicationTranslationsComponent', () => {
  let component: ApplicationTranslationsComponent;
  let fixture: ComponentFixture<ApplicationTranslationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationTranslationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationTranslationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
