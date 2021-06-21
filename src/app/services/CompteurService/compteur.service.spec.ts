import { TestBed } from '@angular/core/testing';

import { CompteurService } from './compteur.service';

describe('CompteurService', () => {
  let service: CompteurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompteurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
