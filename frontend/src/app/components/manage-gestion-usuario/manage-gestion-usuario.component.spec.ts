import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageGestionUsuarioComponent } from './manage-gestion-usuario.component';

describe('ManageGestionUsuarioComponent', () => {
  let component: ManageGestionUsuarioComponent;
  let fixture: ComponentFixture<ManageGestionUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageGestionUsuarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageGestionUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
