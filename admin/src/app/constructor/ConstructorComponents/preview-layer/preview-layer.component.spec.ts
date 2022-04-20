import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewLayerComponent } from './preview-layer.component';

describe('PreviewLayerComponent', () => {
  let component: PreviewLayerComponent;
  let fixture: ComponentFixture<PreviewLayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewLayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
