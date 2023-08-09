import { TestBed } from '@angular/core/testing';

import { EntidadEjecutoraService } from './entidad-ejecutora.service';

describe('EntidadEjecutoraService', () => {
  let service: EntidadEjecutoraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntidadEjecutoraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
