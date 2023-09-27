import { TestBed } from '@angular/core/testing';

import { LineasEstrategicasService } from './lineas-estrategicas.service';

describe('LineasEstrategicasService', () => {
  let service: LineasEstrategicasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LineasEstrategicasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
