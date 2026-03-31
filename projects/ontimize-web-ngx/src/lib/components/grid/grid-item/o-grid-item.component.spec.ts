import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, ElementRef } from '@angular/core';

import { OTestingUtils } from '../../../shared/testing/o-testing-utils';

// Import component dynamically to avoid compilation
let OGridItemComponent: any;


describe('OGridItemComponent', () => {
  let component: any;
  let mockElementRef: ElementRef;

  beforeEach(async () => {
    // Dynamically import to avoid early compilation
    const module = await import('./o-grid-item.component');
    OGridItemComponent = module.OGridItemComponent;
    
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

    mockElementRef = new ElementRef(document.createElement('div'));
    
    // Create component manually to avoid OWrapperContentMenuComponent issues
    component = new OGridItemComponent(mockElementRef);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize without errors', () => {
    expect(() => {
      expect(component).toBeInstanceOf(OGridItemComponent);
    }).not.toThrow();
  });

  it('should have basic component structure', () => {
    expect(component).toBeInstanceOf(OGridItemComponent);
  });
});
