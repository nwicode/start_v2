import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InnerLogoEditComponent } from './inner-logo-edit.component';

describe('InnerLogoEditComponent', () => {
  let component: InnerLogoEditComponent;
  let fixture: ComponentFixture<InnerLogoEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InnerLogoEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InnerLogoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
