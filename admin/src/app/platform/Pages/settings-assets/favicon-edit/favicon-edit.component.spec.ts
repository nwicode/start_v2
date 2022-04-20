import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaviconEditComponent } from './favicon-edit.component';

describe('FaviconEditComponent', () => {
  let component: FaviconEditComponent;
  let fixture: ComponentFixture<FaviconEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaviconEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FaviconEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
