import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemColorComponent } from './system-color.component';

describe('SystemColorComponent', () => {
  let component: SystemColorComponent;
  let fixture: ComponentFixture<SystemColorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemColorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
