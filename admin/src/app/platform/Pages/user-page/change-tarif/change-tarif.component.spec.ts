import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeTarifComponent } from './change-tarif.component';

describe('ChangeTarifComponent', () => {
  let component: ChangeTarifComponent;
  let fixture: ComponentFixture<ChangeTarifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeTarifComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeTarifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
