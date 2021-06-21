import { TestBed } from '@angular/core/testing';

import { RelanceService } from './relance.service';

describe('RelanceService', () => {
  let service: RelanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RelanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
