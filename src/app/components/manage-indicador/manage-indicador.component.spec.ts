import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageIndicadorComponent } from './manage-indicador.component';

describe('ManageIndicadorComponent', () => {
  let component: ManageIndicadorComponent;
  let fixture: ComponentFixture<ManageIndicadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageIndicadorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageIndicadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
