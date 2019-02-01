import { TestBed } from '@angular/core/testing';

import { GenerateDurationService } from './generate-duration.service';

describe('GenerateDurationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GenerateDurationService = TestBed.get(GenerateDurationService);
    expect(service).toBeTruthy();
  });
});
