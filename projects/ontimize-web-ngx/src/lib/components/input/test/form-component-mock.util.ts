import { FormControl } from '@angular/forms';

/**
 * Utility class for creating mock OFormComponent objects for input component testing.
 * This provides a comprehensive mock that covers all the essential OFormComponent interface methods
 * to avoid "function is not defined" errors during component initialization and lifecycle.
 */
export class FormComponentMockUtil {
  
  /**
   * Creates a complete mock OFormComponent with all essential methods properly stubbed.
   * This mock is designed to handle component registration, form state management,
   * and data operations without throwing errors.
   * 
   * @returns A comprehensive mock object implementing the OFormComponent interface
   */
  static createMockOFormComponent(): any {
    return {
      // === REGISTRATION METHODS ===
      // Basic component registration
      registerFormComponent: jasmine.createSpy('registerFormComponent'),
      unregisterFormComponent: jasmine.createSpy('unregisterFormComponent'),
      
      // Form control specific registration
      registerFormControlComponent: jasmine.createSpy('registerFormControlComponent'),
      unregisterFormControlComponent: jasmine.createSpy('unregisterFormControlComponent'),
      
      // SQL type registration (for components like integer, real, etc.)
      registerSQLTypeFormComponent: jasmine.createSpy('registerSQLTypeFormComponent'),
      unregisterSQLTypeFormComponent: jasmine.createSpy('unregisterSQLTypeFormComponent'),
      
      // === COMPONENT MANAGEMENT ===
      getRegisteredFieldComponents: jasmine.createSpy('getRegisteredFieldComponents').and.returnValue([]),
      getFormControl: jasmine.createSpy('getFormControl').and.returnValue(null),
      
      // === FORM STATE METHODS ===
      // Form mode detection
      isInUpdateMode: jasmine.createSpy('isInUpdateMode').and.returnValue(false),
      isInInsertMode: jasmine.createSpy('isInInsertMode').and.returnValue(false),
      isInInitialMode: jasmine.createSpy('isInInitialMode').and.returnValue(true),
      
      // Form editability and state
      isEditableDetail: jasmine.createSpy('isEditableDetail').and.returnValue(true),
      isDisabled: jasmine.createSpy('isDisabled').and.returnValue(false),
      
      // === DATA METHODS ===
      getDataValue: jasmine.createSpy('getDataValue').and.returnValue(null),
      setDataValue: jasmine.createSpy('setDataValue'),
      clearData: jasmine.createSpy('clearData'),
      
      // === FORM GROUP ===
      formGroup: {
        addControl: jasmine.createSpy('addControl'),
        removeControl: jasmine.createSpy('removeControl'),
        get: jasmine.createSpy('get').and.returnValue(null),
        controls: {}
      }
    };
  }

  /**
   * Creates a mock ElementRef suitable for component testing.
   * Provides a basic DOM element that components can safely interact with.
   * 
   * @returns A mock ElementRef with a basic div element
   */
  static createMockElementRef(): any {
    return {
      nativeElement: document.createElement('div')
    };
  }

  /**
   * Validates that a mock form component has all essential methods defined.
   * Useful for ensuring mock completeness in tests.
   * 
   * @param mockForm The mock form component to validate
   * @returns Array of missing method names (empty if all methods are present)
   */
  static validateMockCompleteness(mockForm: any): string[] {
    const requiredMethods = [
      'registerFormComponent',
      'unregisterFormComponent', 
      'registerFormControlComponent',
      'unregisterFormControlComponent',
      'registerSQLTypeFormComponent',
      'unregisterSQLTypeFormComponent',
      'getRegisteredFieldComponents',
      'getFormControl',
      'isInUpdateMode',
      'isInInsertMode', 
      'isInInitialMode',
      'isEditableDetail',
      'isDisabled',
      'getDataValue',
      'setDataValue',
      'clearData'
    ];

    const missingMethods: string[] = [];
    
    for (const method of requiredMethods) {
      if (typeof mockForm[method] !== 'function') {
        missingMethods.push(method);
      }
    }

    return missingMethods;
  }

  /**
   * Creates a complete setup for input component testing including form mock,
   * element ref mock, and injector from TestBed.
   * 
   * @param ComponentClass The component class to instantiate
   * @param injector TestBed injector instance
   * @returns Object containing the component instance and all mocks
   */
  static createInputComponentTestSetup<T>(ComponentClass: new (...args: any[]) => T, injector: any): {
    component: T;
    mockForm: any;
    mockElementRef: any;
    injector: any;
  } {
    const mockForm = this.createMockOFormComponent();
    const mockElementRef = this.createMockElementRef();
    
    const component = new ComponentClass(mockForm, mockElementRef, injector);
    
    // Initialize with real Angular FormControl to ensure all methods are available
    // This prevents "setAsyncValidators is not a function" and similar errors
    const realFormControl = new FormControl();
    
    // Safely set the form control if the component has this property
    if (component && typeof component === 'object') {
      (component as any)._fControl = realFormControl;
    }
    
    return {
      component,
      mockForm,
      mockElementRef,
      injector
    };
  }

  /**
   * Creates a setup for components with special dependencies like CountryCode service.
   * Supports components that need additional services injected before form and elementRef.
   * 
   * @param ComponentClass The component class to instantiate
   * @param injector TestBed injector instance
   * @param additionalDependencies Array of additional mock dependencies to inject first
   * @returns Object containing the component instance and all mocks
   */
  static createSpecialInputComponentTestSetup<T>(
    ComponentClass: new (...args: any[]) => T, 
    injector: any, 
    additionalDependencies: any[] = []
  ): {
    component: T;
    mockForm: any;
    mockElementRef: any;
    injector: any;
    additionalMocks: any[];
  } {
    const mockForm = this.createMockOFormComponent();
    const mockElementRef = this.createMockElementRef();
    
    // Construct arguments array: [additionalDependencies..., form, elementRef, injector]
    const constructorArgs = [...additionalDependencies, mockForm, mockElementRef, injector];
    const component = new ComponentClass(...constructorArgs);
    
    // Initialize with real Angular FormControl to ensure all methods are available
    const realFormControl = new FormControl();
    
    // Safely set the form control if the component has this property
    if (component && typeof component === 'object') {
      (component as any)._fControl = realFormControl;
    }
    
    return {
      component,
      mockForm,
      mockElementRef,
      injector,
      additionalMocks: additionalDependencies
    };
  }

  /**
   * Creates a mock CountryCode service for phone input components.
   * Provides basic country data commonly used in phone input testing.
   * 
   * @returns Mock CountryCode service with sample country data
   */
  static createMockCountryCodeService(): any {
    return {
      allCountries: [
        ['United States', 'us', '1'],
        ['United Kingdom', 'gb', '44'],
        ['Spain', 'es', '34'],
        ['Germany', 'de', '49'],
        ['France', 'fr', '33']
      ]
    };
  }
}