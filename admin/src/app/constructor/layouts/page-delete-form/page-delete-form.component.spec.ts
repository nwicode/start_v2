import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageDeleteFormComponent } from './page-delete-form.component';

describe('PageDeleteFormComponent', () => {
  let component: PageDeleteFormComponent;
  let fixture: ComponentFixture<PageDeleteFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageDeleteFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageDeleteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
