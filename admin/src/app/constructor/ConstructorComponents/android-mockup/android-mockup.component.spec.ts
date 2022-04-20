import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AndroidMockupComponent } from './android-mockup.component';

describe('AndroidMockupComponent', () => {
  let component: AndroidMockupComponent;
  let fixture: ComponentFixture<AndroidMockupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AndroidMockupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AndroidMockupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
