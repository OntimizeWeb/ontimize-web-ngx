import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, ElementRef, Injector } from '@angular/core';

import { OTestingUtils } from '../../../shared/testing/o-testing-utils';

// Import component dynamically to avoid compilation
let ORowComponent: any;


describe('ORowComponent', () => {
  let component: any;
  let mockElementRef: ElementRef;
  let injector: Injector;

  beforeEach(async () => {
    // Dynamically import to avoid early compilation
    const module = await import('./o-row.component');
    ORowComponent = module.ORowComponent;
    
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

    injector = TestBed.inject(Injector);
    mockElementRef = new ElementRef(document.createElement('div'));
    
    // Create component manually to avoid OWrapperContentMenuComponent issues
    component = new ORowComponent(mockElementRef, injector, null);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize without errors', () => {
    expect(() => {
      // Just verify component was created successfully
      expect(component).toBeInstanceOf(ORowComponent);
    }).not.toThrow();
  });

  it('should have basic component structure', () => {
    expect(component).toBeInstanceOf(ORowComponent);
  });

  it('should have default property values', () => {
    expect(component.oattr).toBeUndefined();
    expect(component.title).toBeUndefined();
    expect(component.icon).toBeUndefined();
    expect(component._elevation).toBe(0);
    expect(component.defaultLayoutAlign).toBe('start start');
    expect(component._layoutAlign).toBeUndefined();
    expect(component._appearance).toBeUndefined();
    expect(component._layoutGap).toBeUndefined();
  });

  it('should set oattr property', () => {
    component.oattr = 'test-attr';
    expect(component.oattr).toBe('test-attr');
  });

  it('should set title property', () => {
    component.title = 'Test Title';
    expect(component.title).toBe('Test Title');
  });

  it('should set icon property', () => {
    component.icon = 'home';
    expect(component.icon).toBe('home');
  });

  it('should set elevation property', () => {
    component.elevation = 3;
    expect(component.elevation).toBe(3);
    expect(component._elevation).toBe(3);
  });

  it('should set layoutAlign property', () => {
    component.layoutAlign = 'center center';
    expect(component.layoutAlign).toBe('center center');
    
    // Test default value when empty
    component.layoutAlign = '';
    expect(component.layoutAlign).toBe('start start');
  });

  it('should set layoutGap property', () => {
    component.layoutGap = '8px';
    expect(component.layoutGap).toBe('8px');
  });

  it('should set appearance property', () => {
    component.appearance = 'outline';
    expect(component.appearance).toBe('outline');
  });

  it('should check hasHeader when no title or icon', () => {
    component.title = undefined;
    component.icon = undefined;
    expect(component.hasHeader()).toBe(false);
  });

  it('should check hasHeader when title is set', () => {
    component.title = 'Test Title';
    component.icon = undefined;
    expect(component.hasHeader()).toBe(true);
  });

  it('should check hasHeader when icon is set', () => {
    component.title = undefined;
    component.icon = 'home';
    expect(component.hasHeader()).toBe(true);
  });

  it('should check hasHeader when both title and icon are set', () => {
    component.title = 'Test Title';
    component.icon = 'home';
    expect(component.hasHeader()).toBe(true);
  });

  it('should check isAppearanceOutlineSetted', () => {
    component._appearance = undefined;
    expect(component.isAppearanceOutlineSetted()).toBe(false);
    
    component._appearance = 'outline';
    expect(component.isAppearanceOutlineSetted()).toBe(true);
    
    component._appearance = 'standard';
    expect(component.isAppearanceOutlineSetted()).toBe(false);
  });

  it('should check hasHeaderOrAppearanceOutlineSetted', () => {
    component.title = undefined;
    component.icon = undefined;
    component._appearance = undefined;
    expect(component.hasHeaderOrAppearanceOutlineSetted()).toBe(false);
    
    component.title = 'Test';
    expect(component.hasHeaderOrAppearanceOutlineSetted()).toBe(true);
  });

  it('should check hasHeaderAndAppearanceOutline', () => {
    component.title = 'Test';
    component._appearance = 'outline';
    component.matFormDefaultOption = undefined;
    expect(component.hasHeaderAndAppearanceOutline()).toBe(true);
    
    component.title = undefined;
    expect(component.hasHeaderAndAppearanceOutline()).toBe(false);
  });

  it('should check isAppearanceOutline with matFormDefaultOption', () => {
    component._appearance = undefined;
    component.matFormDefaultOption = { appearance: 'outline' };
    expect(component.isAppearanceOutline()).toBe(true);
    
    component.matFormDefaultOption = { appearance: 'standard' };
    expect(component.isAppearanceOutline()).toBe(false);
  });

  it('should check isAppearanceOutline with explicit appearance', () => {
    component._appearance = 'outline';
    component.matFormDefaultOption = { appearance: 'standard' };
    expect(component.isAppearanceOutline()).toBe(true);
  });

  it('should check hasTitleInAppearanceOutline', () => {
    component.title = 'Test';
    component._appearance = 'outline';
    component.matFormDefaultOption = undefined;
    expect(component.hasTitleInAppearanceOutline()).toBe(true);
    
    component._appearance = 'standard';
    expect(component.hasTitleInAppearanceOutline()).toBe(false);
  });

  it('should get attribute from oattr', () => {
    component.oattr = 'test-attr';
    expect(component.getAttribute()).toBe('test-attr');
  });

  it('should have constant APPEARANCE_OUTLINE', () => {
    expect(component.constructor.APPEARANCE_OUTLINE).toBe('outline');
  });

  it('should handle cleanElevationCSSclasses without throwing error', () => {
    expect(() => {
      component.cleanElevationCSSclasses();
    }).not.toThrow();
  });
});
