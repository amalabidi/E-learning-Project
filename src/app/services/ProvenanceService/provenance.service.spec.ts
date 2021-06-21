import { TestBed } from '@angular/core/testing';

import { ProvenanceService } from './provenance.service';

describe('ProvenanceService', () => {
  let service: ProvenanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProvenanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
