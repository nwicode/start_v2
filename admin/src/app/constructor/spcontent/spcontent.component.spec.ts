import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SPContentComponent } from './spcontent.component';

describe('SPContentComponent', () => {
  let component: SPContentComponent;
  let fixture: ComponentFixture<SPContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SPContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SPContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
