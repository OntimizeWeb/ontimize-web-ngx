import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OFilterBuilderQueryButtonComponent } from './filter-builder-query-button.component';

describe('FilterBuilderQueryButtonComponent', () => {
  let component: OFilterBuilderQueryButtonComponent;
  let fixture: ComponentFixture<OFilterBuilderQueryButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OFilterBuilderQueryButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OFilterBuilderQueryButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
