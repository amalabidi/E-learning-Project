import { TestBed } from '@angular/core/testing';

import { SuiviModifService } from './suivi-modif.service';

describe('SuiviModifService', () => {
  let service: SuiviModifService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuiviModifService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
