import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivosProyectoComponent } from './archivos-proyecto.component';

describe('ArchivosProyectoComponent', () => {
  let component: ArchivosProyectoComponent;
  let fixture: ComponentFixture<ArchivosProyectoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchivosProyectoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArchivosProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
