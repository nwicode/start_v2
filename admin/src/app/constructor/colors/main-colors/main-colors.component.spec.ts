import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainColorsComponent } from './main-colors.component';

describe('MainColorsComponent', () => {
  let component: MainColorsComponent;
  let fixture: ComponentFixture<MainColorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainColorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainColorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
