import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageProyectoComponent } from './manage-proyecto.component';

describe('ManageProyectoComponent', () => {
  let component: ManageProyectoComponent;
  let fixture: ComponentFixture<ManageProyectoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageProyectoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
