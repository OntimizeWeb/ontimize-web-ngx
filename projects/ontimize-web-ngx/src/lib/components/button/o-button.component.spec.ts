import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Injector, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OTestingUtils } from '../../shared/testing/o-testing-utils';

// Import component dynamically to avoid compilation
let OButtonComponent: any;


describe('OButtonComponent', () => {
  let component: any;
  let injector: Injector;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    // Dynamically import to avoid early compilation
    const module = await import('./o-button.component');
    OButtonComponent = module.OButtonComponent;
    
    // Create mock for ActivatedRoute
    mockActivatedRoute = jasmine.createSpyObj('ActivatedRoute', [], {
      params: of({}),
      queryParams: of({}),
      snapshot: { params: {}, queryParams: {} }
    });

    await TestBed.configureTestingModule({
      declarations: [...OTestingUtils.getCommonDeclarations()],
      imports: [
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    injector = TestBed.inject(Injector);
    
    // Create component manually to avoid OWrapperContentMenuComponent issues
    component = new OButtonComponent(injector, mockActivatedRoute);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize without errors', () => {
    expect(() => {
      expect(component).toBeInstanceOf(OButtonComponent);
    }).not.toThrow();
  });

  it('should have basic component structure', () => {
    expect(component).toBeInstanceOf(OButtonComponent);
  });

  // Test default values and initialization
  it('should have default values after construction', () => {
    expect(component.otype).toBe('STROKED');
    expect(component.enabled).toBe(true);
    expect(component.visible).toBe(true);
    expect(component.iconPosition).toBe('left');
    expect(component.onClick).toBeInstanceOf(EventEmitter);
    expect(component.click).toBeInstanceOf(EventEmitter);
  });

  // Test ngOnInit method
  it('should convert otype to uppercase on ngOnInit', () => {
    component.otype = 'raised';
    component.oattr = 'test-button';
    
    spyOn(component['permissionsService'], 'getOButtonPermissions').and.returnValue({
      enabled: true,
      visible: true
    });
    
    component.ngOnInit();
    
    expect(component.otype).toBe('RAISED');
  });

  it('should apply permissions on ngOnInit when defined', () => {
    component.oattr = 'test-button';
    const mockPermissions = { enabled: false, visible: false };
    
    spyOn(component['permissionsService'], 'getOButtonPermissions').and.returnValue(mockPermissions);
    
    component.ngOnInit();
    
    expect(component.enabled).toBe(false);
    expect(component.visible).toBe(false);
  });

  it('should handle ngOnInit when permissions are undefined', () => {
    component.oattr = 'test-button';
    
    spyOn(component['permissionsService'], 'getOButtonPermissions').and.returnValue(undefined);
    
    expect(() => {
      component.ngOnInit();
    }).not.toThrow();
    
    expect(component.enabled).toBe(true);
    expect(component.visible).toBe(true);
  });

  // Test button click handling
  it('should emit click events when enabled and onButtonClick is called', () => {
    component.enabled = true;
    const mockEvent = new MouseEvent('click');
    spyOn(mockEvent, 'stopPropagation');
    spyOn(component.click, 'emit');
    spyOn(component.onClick, 'emit');
    
    component.onButtonClick(mockEvent);
    
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(component.click.emit).toHaveBeenCalledWith(mockEvent);
    expect(component.onClick.emit).toHaveBeenCalledWith(mockEvent);
  });

  it('should not emit click events when disabled', () => {
    component.enabled = false;
    const mockEvent = new MouseEvent('click');
    spyOn(mockEvent, 'stopPropagation');
    spyOn(component.click, 'emit');
    spyOn(component.onClick, 'emit');
    
    component.onButtonClick(mockEvent);
    
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(component.click.emit).not.toHaveBeenCalled();
    expect(component.onClick.emit).not.toHaveBeenCalled();
  });

  // Test needsIconButtonClass getter
  it('should return true for needsIconButtonClass when icon is defined and no label', () => {
    component.icon = 'home';
    component.olabel = '';
    
    expect(component.needsIconButtonClass).toBe(true);
  });

  it('should return true for needsIconButtonClass when svgIcon is defined and no label', () => {
    component.svgIcon = 'custom-icon';
    component.olabel = undefined;
    
    expect(component.needsIconButtonClass).toBe(true);
  });

  it('should return false for needsIconButtonClass when label is defined', () => {
    component.icon = 'home';
    component.olabel = 'Home Button';
    
    expect(component.needsIconButtonClass).toBe(false);
  });

  it('should return false for needsIconButtonClass when no icon is defined', () => {
    component.icon = undefined;
    component.svgIcon = undefined;
    component.olabel = '';
    
    expect(component.needsIconButtonClass).toBe(false);
  });

  // Test button type checking methods
  it('should correctly identify FAB type', () => {
    component.otype = 'FAB';
    expect(component.isFab()).toBe(true);
    
    component.otype = 'RAISED';
    expect(component.isFab()).toBe(false);
  });

  it('should correctly identify RAISED type', () => {
    component.otype = 'RAISED';
    expect(component.isRaised()).toBe(true);
    
    component.otype = 'FLAT';
    expect(component.isRaised()).toBe(false);
  });

  it('should correctly identify FLAT type', () => {
    component.otype = 'FLAT';
    expect(component.isFlat()).toBe(true);
    
    component.otype = 'RAISED';
    expect(component.isFlat()).toBe(false);
  });

  it('should correctly identify STROKED type', () => {
    component.otype = 'STROKED';
    expect(component.isStroked()).toBe(true);
    
    // Should also return true for undefined/null otype (default)
    component.otype = null;
    expect(component.isStroked()).toBe(true);
    
    component.otype = undefined;
    expect(component.isStroked()).toBe(true);
    
    component.otype = 'RAISED';
    expect(component.isStroked()).toBe(false);
  });

  it('should correctly identify BASIC type', () => {
    component.otype = 'BASIC';
    expect(component.isBasic()).toBe(true);
    
    component.otype = 'RAISED';
    expect(component.isBasic()).toBe(false);
  });

  it('should correctly identify FAB-MINI type', () => {
    component.otype = 'FAB-MINI';
    expect(component.isMiniFab()).toBe(true);
    
    component.otype = 'FAB';
    expect(component.isMiniFab()).toBe(false);
  });

  it('should correctly identify ICON type', () => {
    component.otype = 'ICON';
    expect(component.isIconButton()).toBe(true);
    
    component.otype = 'RAISED';
    expect(component.isIconButton()).toBe(false);
  });

  // Test visibility method
  it('should return visibility status correctly', () => {
    component.visible = true;
    expect(component.isVisible()).toBe(true);
    
    component.visible = false;
    expect(component.isVisible()).toBe(false);
  });

  // Test property setters and getters
  it('should handle enabled property changes', () => {
    component.enabled = 'true' as any; // Test BooleanInputConverter
    expect(component.enabled).toBe(true);
    
    component.enabled = 'false' as any;
    expect(component.enabled).toBe(false);
    
    component.enabled = false;
    expect(component.enabled).toBe(false);
  });

  // Test color property
  it('should accept valid theme palette colors', () => {
    component.color = 'primary';
    expect(component.color).toBe('primary');
    
    component.color = 'accent';
    expect(component.color).toBe('accent');
    
    component.color = 'warn';
    expect(component.color).toBe('warn');
  });

  // Test static default type
  it('should have correct default type', () => {
    expect(OButtonComponent['DEFAULT_TYPE']).toBe('STROKED');
  });

  // Test ngOnInit with various otype values
  it('should handle ngOnInit with fab type', () => {
    const testComponent = new OButtonComponent(injector, mockActivatedRoute);
    testComponent.otype = 'fab';
    testComponent.oattr = 'test-fab';
    spyOn(testComponent['permissionsService'], 'getOButtonPermissions').and.returnValue(undefined);
    
    testComponent.ngOnInit();
    expect(testComponent.otype).toBe('FAB');
  });

  it('should handle ngOnInit with raised type', () => {
    const testComponent = new OButtonComponent(injector, mockActivatedRoute);
    testComponent.otype = 'raised';
    testComponent.oattr = 'test-raised';
    spyOn(testComponent['permissionsService'], 'getOButtonPermissions').and.returnValue(undefined);
    
    testComponent.ngOnInit();
    expect(testComponent.otype).toBe('RAISED');
  });

  it('should handle ngOnInit with flat type', () => {
    const testComponent = new OButtonComponent(injector, mockActivatedRoute);
    testComponent.otype = 'flat';
    testComponent.oattr = 'test-flat';
    spyOn(testComponent['permissionsService'], 'getOButtonPermissions').and.returnValue(undefined);
    
    testComponent.ngOnInit();
    expect(testComponent.otype).toBe('FLAT');
  });

  // Test EventEmitter functionality
  it('should have properly initialized EventEmitters', () => {
    expect(component.onClick).toBeInstanceOf(EventEmitter);
    expect(component.click).toBeInstanceOf(EventEmitter);
    
    let clickEventReceived = false;
    let onClickEventReceived = false;
    
    component.click.subscribe(() => {
      clickEventReceived = true;
    });
    
    component.onClick.subscribe(() => {
      onClickEventReceived = true;
    });
    
    const mockEvent = new MouseEvent('click');
    component.enabled = true;
    component.onButtonClick(mockEvent);
    
    expect(clickEventReceived).toBe(true);
    expect(onClickEventReceived).toBe(true);
  });
});
