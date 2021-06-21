import { TestBed } from '@angular/core/testing';

import { ModeleRelanceService } from './modele-relance.service';

describe('ModeleRelanceService', () => {
  let service: ModeleRelanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModeleRelanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
