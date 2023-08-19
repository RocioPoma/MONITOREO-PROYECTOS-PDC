import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionEtapaComponent } from './gestion-etapa.component';

describe('GestionEtapaComponent', () => {
  let component: GestionEtapaComponent;
  let fixture: ComponentFixture<GestionEtapaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionEtapaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionEtapaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
