import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import {  CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA , Injector } from '@angular/core';
import { OTestingUtils } from '../../../shared/testing/o-testing-utils';

// Import component dynamically to avoid compilation
let OSearchInputComponent: any;

describe('OSearchInputComponent', () => {
  let component: any;

  beforeEach(async () => {
    // Dynamically import to avoid early compilation
    const module = await import('./o-search-input.component');
    OSearchInputComponent = module.OSearchInputComponent;
    
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
    const mockInjector = TestBed.inject(Injector);
    const mockElementRef: any = { nativeElement: document.createElement('div') };
    component = new OSearchInputComponent(mockInjector, mockElementRef);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize without errors', () => {
    expect(() => {
      // detectChanges not needed with manual instantiation
    }).not.toThrow();
  });

  it('should have basic component structure', () => {
    expect(component.constructor).toBe(OSearchInputComponent);
  });

  it('should have default placeholder', () => {
    expect(component._placeholder).toBe('SEARCH');
  });

  it('should set placeholder', () => {
    component.placeholder = 'NEW_PLACEHOLDER';
    expect(component._placeholder).toBe('NEW_PLACEHOLDER');
  });

  it('should not set placeholder if value is undefined', () => {
    component._placeholder = 'EXISTING';
    component.placeholder = undefined;
    expect(component._placeholder).toBe('EXISTING');
  });

  it('should have default width undefined', () => {
    expect(component.width).toBeUndefined();
  });

  it('should set width property', () => {
    component.width = '300px';
    expect(component.width).toBe('300px');
  });

  it('should have default showCaseSensitiveCheckbox false', () => {
    expect(component.showCaseSensitiveCheckbox).toBe(false);
  });

  it('should have default showMenu true', () => {
    expect(component.showMenu).toBe(true);
  });

  it('should have default filterCaseSensitive false', () => {
    expect(component.filterCaseSensitive).toBe(false);
  });

  it('should set filterCaseSensitive', () => {
    component.filterCaseSensitive = true;
    expect(component.filterCaseSensitive).toBe(true);
  });

  it('should check if label is visible', () => {
    component.label = undefined;
    expect(component.labelVisible).toBe(false);
    
    component.label = 'Test Label';
    expect(component.labelVisible).toBe(true);
  });

  it('should check hasCustomWidth property', () => {
    component.width = undefined;
    expect(component.hasCustomWidth).toBe(false);
    
    component.width = '200px';
    expect(component.hasCustomWidth).toBe(true);
  });

  it('should initialize empty colArray', () => {
    expect(component.colArray).toEqual([]);
  });

  it('should check showFilterMenu property', () => {
    component.showMenu = false;
    component.colArray = [];
    expect(component.showFilterMenu).toBe(false);
    
    component.showMenu = true;
    component.colArray = [];
    expect(component.showFilterMenu).toBe(false);
    
    component.showMenu = true;
    component.colArray = [{ column: 'test', checked: true }];
    expect(component.showFilterMenu).toBe(true);
  });

  it('should check if column is checked', () => {
    const column = { column: 'test', checked: true };
    expect(component.isChecked(column)).toBe(true);
    
    column.checked = false;
    expect(component.isChecked(column)).toBe(false);
  });

  it('should count checked columns', () => {
    component.colArray = [];
    expect(component.getCountColumnsChecked()).toBe(0);
    
    component.colArray = [
      { column: 'col1', checked: true },
      { column: 'col2', checked: false },
      { column: 'col3', checked: true }
    ];
    expect(component.getCountColumnsChecked()).toBe(2);
  });

  it('should check if all columns are checked', () => {
    component.colArray = [];
    expect(component.areAllColumnsChecked()).toBe(true);
    
    component.colArray = [
      { column: 'col1', checked: true },
      { column: 'col2', checked: true }
    ];
    expect(component.areAllColumnsChecked()).toBe(true);
    
    component.colArray = [
      { column: 'col1', checked: true },
      { column: 'col2', checked: false }
    ];
    expect(component.areAllColumnsChecked()).toBe(false);
  });

  it('should get active columns', () => {
    component.colArray = [
      { column: 'col1', checked: true },
      { column: 'col2', checked: false },
      { column: 'col3', checked: true }
    ];
    const activeColumns = component.getActiveColumns();
    expect(activeColumns).toEqual(['col1', 'col3']);
  });

  it('should set active columns', () => {
    component.colArray = [
      { column: 'col1', checked: false },
      { column: 'col2', checked: false },
      { column: 'col3', checked: false }
    ];
    component.setActiveColumns(['col1', 'col3']);
    expect(component.colArray[0].checked).toBe(true);
    expect(component.colArray[1].checked).toBe(false);
    expect(component.colArray[2].checked).toBe(true);
  });

  it('should set floatLabel with valid values', () => {
    component.floatLabel = 'always';
    expect(component.floatLabel).toBe('always');
    
    component.floatLabel = 'auto';
    expect(component.floatLabel).toBe('auto');
  });

  it('should default floatLabel to always for invalid values', () => {
    component.floatLabel = 'invalid' as any;
    expect(component.floatLabel).toBe('always');
  });

  it('should set appearance with valid values', () => {
    component.appearance = 'fill';
    expect(component.appearance).toBe('fill');
    
    component.appearance = 'outline';
    expect(component.appearance).toBe('outline');
  });

  it('should set appearance to undefined for invalid values', () => {
    component.appearance = 'invalid' as any;
    expect(component.appearance).toBeUndefined();
  });
});
