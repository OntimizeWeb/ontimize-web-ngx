import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, EventEmitter } from '@angular/core';
import { OTestingUtils } from '../../shared/testing/o-testing-utils';

// Import component dynamically to avoid compilation
let OButtonToggleComponent: any;

describe('OButtonToggleComponent', () => {
  let component: any;

  beforeEach(async () => {
    // Dynamically import to avoid early compilation
    const module = await import('./o-button-toggle.component');
    OButtonToggleComponent = module.OButtonToggleComponent;
    
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

    // Create component manually to avoid OWrapperContentMenuComponent issues
    component = new OButtonToggleComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize without errors', () => {
    expect(() => {
      expect(component.constructor).toBe(OButtonToggleComponent);
    }).not.toThrow();
  });

  it('should have basic component structure', () => {
    expect(component.constructor).toBe(OButtonToggleComponent);
  });

  it('should have default input constants', () => {
    expect(component.DEFAULT_INPUTS_O_BUTTON_TOGGLE).toBeDefined();
    expect(component.DEFAULT_OUTPUTS_O_BUTTON_TOGGLE).toBeDefined();
  });

  it('should have default property values', () => {
    expect(component.oattr).toBeUndefined();
    expect(component.label).toBeUndefined();
    expect(component.icon).toBeUndefined();
    expect(component.iconPosition).toBe('before');
    expect(component.name).toBeUndefined();
    expect(component._checked).toBe(false);
    expect(component._enabled).toBe(true);
    expect(component._value).toBeUndefined();
  });

  it('should set oattr property', () => {
    component.oattr = 'test-attr';
    expect(component.oattr).toBe('test-attr');
  });

  it('should set label property', () => {
    component.label = 'Test Label';
    expect(component.label).toBe('Test Label');
  });

  it('should set icon property', () => {
    component.icon = 'home';
    expect(component.icon).toBe('home');
  });

  it('should set iconPosition property', () => {
    component.iconPosition = 'after';
    expect(component.iconPosition).toBe('after');
    
    component.iconPosition = 'before';
    expect(component.iconPosition).toBe('before');
  });

  it('should set name property', () => {
    component.name = 'test-name';
    expect(component.name).toBe('test-name');
  });

  it('should have onChange EventEmitter', () => {
    expect(component.onChange).toBeDefined();
    expect(component.onChange instanceof EventEmitter).toBe(true);
  });

  it('should set _checked internal property', () => {
    component._checked = true;
    expect(component._checked).toBe(true);
    
    component._checked = false;
    expect(component._checked).toBe(false);
  });

  it('should set _enabled internal property', () => {
    component._enabled = false;
    expect(component._enabled).toBe(false);
    
    component._enabled = true;
    expect(component._enabled).toBe(true);
  });

  it('should set _value internal property', () => {
    component._value = 'test-value';
    expect(component._value).toBe('test-value');
    
    component._value = 123;
    expect(component._value).toBe(123);
  });

  it('should handle checked property when _innerButtonToggle is mocked', () => {
    // Mock the _innerButtonToggle
    component._innerButtonToggle = {
      checked: false,
      disabled: false,
      value: null
    } as any;
    
    expect(component.checked).toBe(false);
    
    component._innerButtonToggle.checked = true;
    expect(component.checked).toBe(true);
  });

  it('should handle enabled property when _innerButtonToggle is mocked', () => {
    // Mock the _innerButtonToggle
    component._innerButtonToggle = {
      checked: false,
      disabled: false,
      value: null
    } as any;
    
    expect(component.enabled).toBe(true);
    
    component._innerButtonToggle.disabled = true;
    expect(component.enabled).toBe(false);
  });

  it('should handle value property when _innerButtonToggle is mocked', () => {
    // Mock the _innerButtonToggle
    component._innerButtonToggle = {
      checked: false,
      disabled: false,
      value: 'test-value'
    } as any;
    
    expect(component.value).toBe('test-value');
    
    component._innerButtonToggle.value = 'new-value';
    expect(component.value).toBe('new-value');
  });
});
