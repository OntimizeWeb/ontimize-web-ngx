import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OGridSkeletonComponent } from './o-grid-skeleton.component';

describe('OGridSkeletonComponent', () => {
  let component: OGridSkeletonComponent;
  let fixture: ComponentFixture<OGridSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OGridSkeletonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OGridSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
