import { TestBed } from '@angular/core/testing';

import { TipologiaService } from './tipologia.service';

describe('TipologiaService', () => {
  let service: TipologiaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipologiaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
