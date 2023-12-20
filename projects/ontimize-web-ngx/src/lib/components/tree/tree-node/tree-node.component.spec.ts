/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OTreeNodeComponent } from './tree-node.component';

describe('OTreeNodeComponent', () => {
  let component: OTreeNodeComponent;
  let fixture: ComponentFixture<OTreeNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OTreeNodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OTreeNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
