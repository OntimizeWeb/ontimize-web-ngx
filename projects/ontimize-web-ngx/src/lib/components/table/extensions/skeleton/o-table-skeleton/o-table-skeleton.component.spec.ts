import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OTableSkeletonComponent } from './o-table-skeleton.component';

describe('OTableSkeletonComponent', () => {
  let component: OTableSkeletonComponent;
  let fixture: ComponentFixture<OTableSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OTableSkeletonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OTableSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
