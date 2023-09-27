import { TestBed } from '@angular/core/testing';

import { EtapaService } from './etapa.service';

describe('EtapaService', () => {
  let service: EtapaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EtapaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
