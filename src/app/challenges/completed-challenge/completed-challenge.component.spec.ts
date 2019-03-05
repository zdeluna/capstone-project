import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedChallengeComponent } from './completed-challenge.component';

describe('CompletedChallengeComponent', () => {
  let component: CompletedChallengeComponent;
  let fixture: ComponentFixture<CompletedChallengeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompletedChallengeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletedChallengeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
