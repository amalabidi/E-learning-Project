import { TestBed } from '@angular/core/testing';

import { ConnecteduserService } from './connecteduser.service';

describe('ConnecteduserService', () => {
  let service: ConnecteduserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConnecteduserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
