import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OFilterBuilderMenuComponent } from './filter-builder-menu.component';

describe('FilterBuilderQueryButtonComponent', () => {
  let component: OFilterBuilderMenuComponent;
  let fixture: ComponentFixture<OFilterBuilderMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OFilterBuilderMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OFilterBuilderMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
