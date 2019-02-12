import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveChallengeComponent } from './active-challenge.component';

describe('ActiveChallengeComponent', () => {
  let component: ActiveChallengeComponent;
  let fixture: ComponentFixture<ActiveChallengeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveChallengeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveChallengeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
