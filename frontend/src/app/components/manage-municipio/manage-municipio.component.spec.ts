import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMunicipioComponent } from './manage-municipio.component';

describe('ManageMunicipioComponent', () => {
  let component: ManageMunicipioComponent;
  let fixture: ComponentFixture<ManageMunicipioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageMunicipioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageMunicipioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
