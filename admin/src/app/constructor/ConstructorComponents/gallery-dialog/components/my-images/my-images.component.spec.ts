import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyImagesComponent } from './my-images.component';

describe('MyImagesComponent', () => {
  let component: MyImagesComponent;
  let fixture: ComponentFixture<MyImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyImagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
