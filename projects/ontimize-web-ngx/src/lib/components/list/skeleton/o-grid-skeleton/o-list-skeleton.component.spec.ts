import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OListSkeletonComponent } from './o-list-skeleton.component';

describe('OListSkeletonComponent', () => {
  let component: OListSkeletonComponent;
  let fixture: ComponentFixture<OListSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OListSkeletonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OListSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
