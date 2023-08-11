import { TestBed } from '@angular/core/testing';

import { SeguimientoProyectoService } from './seguimiento-proyecto.service';

describe('SeguimientoProyectoService', () => {
  let service: SeguimientoProyectoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeguimientoProyectoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
