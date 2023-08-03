import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasedeDatosComponent } from './basede-datos.component';

describe('BasedeDatosComponent', () => {
  let component: BasedeDatosComponent;
  let fixture: ComponentFixture<BasedeDatosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasedeDatosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasedeDatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
