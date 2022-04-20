import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageCreateFormComponent } from './page-create-form.component';

describe('PageCreateFormComponent', () => {
  let component: PageCreateFormComponent;
  let fixture: ComponentFixture<PageCreateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageCreateFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
