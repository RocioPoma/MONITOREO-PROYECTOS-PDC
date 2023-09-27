import { TestBed } from '@angular/core/testing';

import { CuencaService } from './cuenca.service';

describe('CuencaService', () => {
  let service: CuencaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CuencaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
