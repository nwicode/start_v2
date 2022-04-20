import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropboxImagesComponent } from './dropbox-images.component';

describe('DropboxImagesComponent', () => {
  let component: DropboxImagesComponent;
  let fixture: ComponentFixture<DropboxImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropboxImagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropboxImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
