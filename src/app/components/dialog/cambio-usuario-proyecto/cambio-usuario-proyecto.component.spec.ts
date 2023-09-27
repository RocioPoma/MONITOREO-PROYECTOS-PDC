import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambioUsuarioProyectoComponent } from './cambio-usuario-proyecto.component';

describe('CambioUsuarioProyectoComponent', () => {
  let component: CambioUsuarioProyectoComponent;
  let fixture: ComponentFixture<CambioUsuarioProyectoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CambioUsuarioProyectoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CambioUsuarioProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
