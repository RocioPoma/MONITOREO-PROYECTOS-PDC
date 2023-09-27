import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEntidadEjecutoraComponent } from './manage-entidad-ejecutora.component';

describe('ManageEntidadEjecutoraComponent', () => {
  let component: ManageEntidadEjecutoraComponent;
  let fixture: ComponentFixture<ManageEntidadEjecutoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageEntidadEjecutoraComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageEntidadEjecutoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
