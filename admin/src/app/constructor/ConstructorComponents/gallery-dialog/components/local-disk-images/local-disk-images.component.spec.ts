import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalDiskImagesComponent } from './local-disk-images.component';

describe('LocalDiskImagesComponent', () => {
  let component: LocalDiskImagesComponent;
  let fixture: ComponentFixture<LocalDiskImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocalDiskImagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalDiskImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
