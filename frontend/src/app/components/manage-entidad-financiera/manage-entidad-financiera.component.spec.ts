import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEntidadFinancieraComponent } from './manage-entidad-financiera.component';

describe('ManageEntidadFinancieraComponent', () => {
  let component: ManageEntidadFinancieraComponent;
  let fixture: ComponentFixture<ManageEntidadFinancieraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageEntidadFinancieraComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageEntidadFinancieraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
