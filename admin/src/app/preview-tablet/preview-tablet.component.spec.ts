import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewTabletComponent } from './preview-tablet.component';

describe('PriviewTabletComponent', () => {
  let component: PreviewTabletComponent;
  let fixture: ComponentFixture<PreviewTabletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewTabletComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewTabletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
