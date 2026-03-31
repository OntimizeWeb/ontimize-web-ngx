import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Injector } from '@angular/core';
import { OTestingUtils } from '../../shared/testing/o-testing-utils';

// Import component dynamically to avoid compilation
let OBreadcrumbComponent: any;

describe('OBreadcrumbComponent', () => {
  let component: any;
  let injector: Injector;

  beforeEach(async () => {
    // Dynamically import to avoid early compilation
    const module = await import('./o-breadcrumb.component');
    OBreadcrumbComponent = module.OBreadcrumbComponent;
    
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
    
    // Create component manually to avoid OWrapperContentMenuComponent issues
    component = new OBreadcrumbComponent(injector);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize without errors', () => {
    expect(() => {
      expect(component).toBeInstanceOf(OBreadcrumbComponent);
    }).not.toThrow();
  });

  it('should have basic component structure', () => {
    expect(component).toBeInstanceOf(OBreadcrumbComponent);
  });

  it('should have default separator', () => {
    expect(component.separator).toBe(' ');
  });

  it('should set separator property', () => {
    component.separator = ' > ';
    expect(component.separator).toBe(' > ');
  });

  it('should initialize breadcrumbs as BehaviorSubject', () => {
    expect(component.breadcrumbs).toBeDefined();
    expect(component.breadcrumbs.value).toEqual([]);
  });

  it('should have labelColumns property', () => {
    expect(component.labelColumns).toBeUndefined();
    component.labelColumns = 'column1;column2';
    expect(component.labelColumns).toBe('column1;column2');
  });

  it('should initialize empty labelColsArray', () => {
    expect(component.labelColsArray).toEqual([]);
  });

  it('should set form property', () => {
    const mockForm = { } as any;
    component.form = mockForm;
    expect(component._formRef).toBe(mockForm);
  });

  it('should have router injected', () => {
    expect(component.router).toBeDefined();
  });

  it('should have oBreadcrumService injected', () => {
    expect(component.oBreadcrumService).toBeDefined();
  });

  it('should check if route is current route', () => {
    const mockRoute = { route: '/test', displayText: 'Test' };
    
    // Mock router state
    const mockSnapshot = { url: '/test?param=value' };
    component.router.routerState = { snapshot: mockSnapshot } as any;
    
    expect(component.isCurrentRoute(mockRoute)).toBe(true);
    
    mockRoute.route = '/other';
    expect(component.isCurrentRoute(mockRoute)).toBe(false);
  });

  it('should handle route click without query params', () => {
    const mockRoute = { route: '/test', displayText: 'Test' };
    spyOn(component.router, 'navigate');
    
    component.onRouteClick(mockRoute);
    
    expect(component.router.navigate).toHaveBeenCalledWith(['/test'], {});
  });

  it('should handle route click with query params', () => {
    const mockRoute = { 
      route: '/test', 
      displayText: 'Test',
      queryParams: { id: 123 }
    };
    spyOn(component.router, 'navigate');
    
    component.onRouteClick(mockRoute);
    
    expect(component.router.navigate).toHaveBeenCalledWith(['/test'], {
      queryParams: { id: 123 }
    });
  });
});
