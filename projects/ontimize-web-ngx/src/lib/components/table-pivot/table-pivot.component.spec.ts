import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OTablePivotComponent } from './table-pivot.component';

describe('OTablePivotComponent', () => {
  let component: OTablePivotComponent;
  let fixture: ComponentFixture<OTablePivotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OTablePivotComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OTablePivotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
