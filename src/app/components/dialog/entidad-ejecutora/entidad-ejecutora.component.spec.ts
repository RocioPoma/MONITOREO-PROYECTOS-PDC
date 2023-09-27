import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntidadEjecutoraComponent } from './entidad-ejecutora.component';

describe('EntidadEjecutoraComponent', () => {
  let component: EntidadEjecutoraComponent;
  let fixture: ComponentFixture<EntidadEjecutoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntidadEjecutoraComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntidadEjecutoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
