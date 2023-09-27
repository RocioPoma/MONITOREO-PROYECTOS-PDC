import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntidadFinancieraComponent } from './entidad-financiera.component';

describe('EntidadFinancieraComponent', () => {
  let component: EntidadFinancieraComponent;
  let fixture: ComponentFixture<EntidadFinancieraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntidadFinancieraComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntidadFinancieraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
