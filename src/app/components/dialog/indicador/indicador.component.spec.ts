import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicadorComponent } from './indicador.component';

describe('IndicadorComponent', () => {
  let component: IndicadorComponent;
  let fixture: ComponentFixture<IndicadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndicadorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndicadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
