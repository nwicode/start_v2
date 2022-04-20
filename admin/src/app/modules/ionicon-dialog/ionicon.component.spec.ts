import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IoniconComponent } from './ionicon.component';

describe('IoniconComponent', () => {
  let component: IoniconComponent;
  let fixture: ComponentFixture<IoniconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IoniconComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IoniconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
