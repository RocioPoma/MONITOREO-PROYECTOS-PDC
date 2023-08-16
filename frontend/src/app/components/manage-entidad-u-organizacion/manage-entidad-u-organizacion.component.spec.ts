import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEntidadUOrganizacionComponent } from './manage-entidad-u-organizacion.component';

describe('ManageEntidadUOrganizacionComponent', () => {
  let component: ManageEntidadUOrganizacionComponent;
  let fixture: ComponentFixture<ManageEntidadUOrganizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageEntidadUOrganizacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageEntidadUOrganizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
