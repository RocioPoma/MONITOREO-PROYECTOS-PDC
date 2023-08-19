import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageGestionEtapaComponent } from './manage-gestion-etapa.component';

describe('ManageGestionEtapaComponent', () => {
  let component: ManageGestionEtapaComponent;
  let fixture: ComponentFixture<ManageGestionEtapaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageGestionEtapaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageGestionEtapaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
