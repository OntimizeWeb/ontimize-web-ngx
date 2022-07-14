import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterBuilderQueryButtonComponent } from './filter-builder-query-button.component';

describe('FilterBuilderQueryButtonComponent', () => {
  let component: FilterBuilderQueryButtonComponent;
  let fixture: ComponentFixture<FilterBuilderQueryButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterBuilderQueryButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterBuilderQueryButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
