import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadLanguageComponent } from './upload-language.component';

describe('UploadLanguageComponent', () => {
  let component: UploadLanguageComponent;
  let fixture: ComponentFixture<UploadLanguageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadLanguageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadLanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
