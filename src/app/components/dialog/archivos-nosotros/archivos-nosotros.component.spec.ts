import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivosNosotrosComponent } from './archivos-nosotros.component';

describe('ArchivosNosotrosComponent', () => {
  let component: ArchivosNosotrosComponent;
  let fixture: ComponentFixture<ArchivosNosotrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchivosNosotrosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArchivosNosotrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
