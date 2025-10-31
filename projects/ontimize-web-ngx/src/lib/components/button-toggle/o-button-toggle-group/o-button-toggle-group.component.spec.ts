import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { OButtonToggleGroupComponent } from './o-button-toggle-group.component';
import { OTestingUtils } from '../../../shared/testing/o-testing-utils';

describe('OButtonToggleGroupComponent', () => {
  let component: OButtonToggleGroupComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [...OTestingUtils.getCommonDeclarations()],
      imports: [
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    // Create component manually to avoid ViewChild lifecycle issues
    component = new OButtonToggleGroupComponent();
    
    // Mock _children QueryList
    (component as any)._children = {
      map: jasmine.createSpy('map').and.returnValue([]),
      changes: { subscribe: jasmine.createSpy() },
      reset: jasmine.createSpy('reset')
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize without errors', () => {
    expect(() => {
      component.ngOnInit();
    }).not.toThrow();
  });

  it('should have basic component structure', () => {
    expect(component).toBeInstanceOf(OButtonToggleGroupComponent);
  });
});
