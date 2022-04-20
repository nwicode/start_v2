import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildQueueComponent } from './build-queue.component';

describe('BuildQueueComponent', () => {
  let component: BuildQueueComponent;
  let fixture: ComponentFixture<BuildQueueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuildQueueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
