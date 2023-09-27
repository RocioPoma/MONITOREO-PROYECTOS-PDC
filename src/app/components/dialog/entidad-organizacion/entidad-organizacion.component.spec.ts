import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntidadOrganizacionComponent } from './entidad-organizacion.component';

describe('EntidadOrganizacionComponent', () => {
  let component: EntidadOrganizacionComponent;
  let fixture: ComponentFixture<EntidadOrganizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntidadOrganizacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntidadOrganizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
