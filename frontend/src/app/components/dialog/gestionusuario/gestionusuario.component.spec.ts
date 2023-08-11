import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionusuarioComponent } from './gestionusuario.component';

describe('GestionusuarioComponent', () => {
  let component: GestionusuarioComponent;
  let fixture: ComponentFixture<GestionusuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionusuarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionusuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
