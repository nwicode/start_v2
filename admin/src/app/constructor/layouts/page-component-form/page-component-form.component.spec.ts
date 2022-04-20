import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageComponentFormComponent } from './page-component-form.component';

describe('PageComponentFormComponent', () => {
  let component: PageComponentFormComponent;
  let fixture: ComponentFixture<PageComponentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageComponentFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageComponentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
