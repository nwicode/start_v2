import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTranslationsComponent } from './edit-translations.component';

describe('EditTranslationsComponent', () => {
  let component: EditTranslationsComponent;
  let fixture: ComponentFixture<EditTranslationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTranslationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTranslationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
