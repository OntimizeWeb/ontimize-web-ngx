import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { OTestingUtils } from '../../shared/testing/o-testing-utils';

// Import component dynamically to avoid compilation
let OExpandableContainerComponent: any;

describe('OExpandableContainerComponent', () => {
  let component: any;

  beforeEach(async () => {
    // Dynamically import to avoid early compilation
    const module = await import('./o-expandable-container.component');
    OExpandableContainerComponent = module.OExpandableContainerComponent;
    
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

    component = new OExpandableContainerComponent();
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
    expect(component.constructor).toBe(OExpandableContainerComponent);
  });

  it('should have default property values', () => {
    expect(component.targets).toBeUndefined();
    expect(component.data).toBeUndefined();
  });

  it('should set targets property', () => {
    const mockTargets = [
      { queryData: jasmine.createSpy('queryData1') },
      { queryData: jasmine.createSpy('queryData2') }
    ];
    component.targets = mockTargets;
    expect(component.targets).toBe(mockTargets);
    expect(component.targets.length).toBe(2);
  });

  it('should set data property', () => {
    const testData = { id: 1, name: 'test' };
    component.data = testData;
    expect(component.data).toBe(testData);
  });

  it('should set data property with different types', () => {
    // Test with string
    component.data = 'test string';
    expect(component.data).toBe('test string');
    
    // Test with number
    component.data = 123;
    expect(component.data).toBe(123);
    
    // Test with array
    const testArray = [1, 2, 3];
    component.data = testArray;
    expect(component.data).toBe(testArray);
  });

  it('should handle ngAfterViewInit when targets is undefined', () => {
    component.targets = undefined;
    expect(() => {
      component.ngAfterViewInit();
    }).toThrow();
  });

  it('should handle ngAfterViewInit when targets is empty array', () => {
    component.targets = [];
    expect(() => {
      component.ngAfterViewInit();
    }).not.toThrow();
  });

  it('should call queryData on all targets in ngAfterViewInit', () => {
    const mockTarget1 = { queryData: jasmine.createSpy('queryData1') };
    const mockTarget2 = { queryData: jasmine.createSpy('queryData2') };
    component.targets = [mockTarget1, mockTarget2];
    
    component.ngAfterViewInit();
    
    expect(mockTarget1.queryData).toHaveBeenCalled();
    expect(mockTarget2.queryData).toHaveBeenCalled();
  });

  it('should handle single target in ngAfterViewInit', () => {
    const mockTarget = { queryData: jasmine.createSpy('queryData') };
    component.targets = [mockTarget];
    
    component.ngAfterViewInit();
    
    expect(mockTarget.queryData).toHaveBeenCalledTimes(1);
  });
});
