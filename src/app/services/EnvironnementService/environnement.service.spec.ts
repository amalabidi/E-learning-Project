import { TestBed } from '@angular/core/testing';

import { EnvironnementService } from './environnement.service';

describe('EnvironnementService', () => {
  let service: EnvironnementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnvironnementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
