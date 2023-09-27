import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageComunidadComponent } from './manage-comunidad.component';

describe('ManageComunidadComponent', () => {
  let component: ManageComunidadComponent;
  let fixture: ComponentFixture<ManageComunidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageComunidadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageComunidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
