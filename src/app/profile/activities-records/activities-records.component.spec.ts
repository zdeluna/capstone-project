import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesRecordsComponent } from './activities-records.component';

describe('ActivitiesRecordsComponent', () => {
  let component: ActivitiesRecordsComponent;
  let fixture: ComponentFixture<ActivitiesRecordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivitiesRecordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitiesRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
