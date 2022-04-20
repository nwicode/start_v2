import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstalledSolutionsComponent } from './installed-solutions.component';

describe('InstalledSolutionsComponent', () => {
  let component: InstalledSolutionsComponent;
  let fixture: ComponentFixture<InstalledSolutionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstalledSolutionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstalledSolutionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
