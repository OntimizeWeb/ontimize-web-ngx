import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OPivotTableComponent } from './pivot-table.component';

describe('OPivotTableComponent', () => {
  let component: OPivotTableComponent;
  let fixture: ComponentFixture<OPivotTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OPivotTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OPivotTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
