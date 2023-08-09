import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoProyectoComponent } from './seguimiento-proyecto.component';

describe('SeguimientoProyectoComponent', () => {
  let component: SeguimientoProyectoComponent;
  let fixture: ComponentFixture<SeguimientoProyectoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeguimientoProyectoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeguimientoProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
