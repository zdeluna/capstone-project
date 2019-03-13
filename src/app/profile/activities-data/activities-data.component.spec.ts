import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesDataComponent } from './activities-data.component';

describe('ActivitiesDataComponent', () => {
  let component: ActivitiesDataComponent;
  let fixture: ComponentFixture<ActivitiesDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivitiesDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitiesDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
