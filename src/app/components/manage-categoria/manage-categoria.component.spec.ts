import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCategoriaComponent } from './manage-categoria.component';

describe('ManageCategoriaComponent', () => {
  let component: ManageCategoriaComponent;
  let fixture: ComponentFixture<ManageCategoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageCategoriaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
