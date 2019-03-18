import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesTotalsComponent } from './activities-totals.component';

describe('ActivitiesTotalsComponent', () => {
  let component: ActivitiesTotalsComponent;
  let fixture: ComponentFixture<ActivitiesTotalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivitiesTotalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitiesTotalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
