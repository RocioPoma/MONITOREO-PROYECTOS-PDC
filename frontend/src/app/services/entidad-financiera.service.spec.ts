import { TestBed } from '@angular/core/testing';

import { EntidadFinancieraService } from './entidad-financiera.service';

describe('EntidadFinancieraService', () => {
  let service: EntidadFinancieraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntidadFinancieraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
