import { TestBed } from '@angular/core/testing';

import { UnidadMedicionService } from './unidad-medicion.service';

describe('UnidadMedicionService', () => {
  let service: UnidadMedicionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnidadMedicionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
