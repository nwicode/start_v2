import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BgImageEditComponent } from './bg-image-edit.component';

describe('BgImageEditComponent', () => {
  let component: BgImageEditComponent;
  let fixture: ComponentFixture<BgImageEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BgImageEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BgImageEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
