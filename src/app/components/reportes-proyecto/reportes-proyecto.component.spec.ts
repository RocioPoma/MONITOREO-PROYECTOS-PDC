import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesProyectoComponent } from './reportes-proyecto.component';

describe('ReportesProyectoComponent', () => {
  let component: ReportesProyectoComponent;
  let fixture: ComponentFixture<ReportesProyectoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportesProyectoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportesProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
