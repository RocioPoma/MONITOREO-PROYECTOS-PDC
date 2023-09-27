import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteIndicadorComponent } from './reporte-indicador.component';

describe('ReporteIndicadorComponent', () => {
  let component: ReporteIndicadorComponent;
  let fixture: ComponentFixture<ReporteIndicadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteIndicadorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteIndicadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
