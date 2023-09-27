import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageNosotrosComponent } from './manage-nosotros.component';

describe('ManageNosotrosComponent', () => {
  let component: ManageNosotrosComponent;
  let fixture: ComponentFixture<ManageNosotrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageNosotrosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageNosotrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
