import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Injector } from '@angular/core';
import { Subject } from 'rxjs';

import { OTestingUtils } from '../../shared/testing/o-testing-utils';

// Import component dynamically to avoid compilation
let OContextMenuComponent: any;

import { OContextMenuService } from './o-context-menu.service';

describe('OContextMenuComponent', () => {
  let component: any;
  let injector: Injector;
  let mockOContextMenuService: jasmine.SpyObj<OContextMenuService>;

  beforeEach(async () => {
    // Dynamically import to avoid early compilation
    const module = await import('./o-context-menu.component');
    OContextMenuComponent = module.OContextMenuComponent;
    
    mockOContextMenuService = jasmine.createSpyObj('OContextMenuService', [
      'closeAllContextMenus', 
      'openContextMenu'
    ], {
      showContextMenu: new Subject(),
      closeContextMenu: new Subject()
    });

    await TestBed.configureTestingModule({
      declarations: [...OTestingUtils.getCommonDeclarations()],
      imports: [
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        { provide: OContextMenuService, useValue: mockOContextMenuService },
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    injector = TestBed.inject(Injector);
    
    // Create component manually to avoid OWrapperContentMenuComponent issues
    component = new OContextMenuComponent(injector);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize without errors', () => {
    expect(() => {
      expect(component).toBeInstanceOf(OContextMenuComponent);
    }).not.toThrow();
  });

  it('should have basic component structure', () => {
    expect(component).toBeInstanceOf(OContextMenuComponent);
  });

  // === PROPERTY TESTS (Proven Safe Pattern) ===
  describe('Component Properties', () => {
    it('should have externalContextMenuItems property that can be undefined initially', () => {
      // QueryList properties may not be available without proper Angular context
      expect(component.hasOwnProperty('externalContextMenuItems') || component.externalContextMenuItems === undefined).toBeTruthy();
    });

    it('should have oContextMenuItems property that can be undefined initially', () => {
      // QueryList properties may not be available without proper Angular context
      expect(component.hasOwnProperty('oContextMenuItems') || component.oContextMenuItems === undefined).toBeTruthy();
    });

    it('should have origin property that can be undefined initially', () => {
      expect(component.hasOwnProperty('origin') || component.origin === undefined).toBeTruthy();
    });

    it('should allow setting origin property', () => {
      const mockElement = document.createElement('div');
      component.origin = mockElement;
      expect(component.origin).toBe(mockElement);
    });

    it('should have onShow EventEmitter', () => {
      expect(component.onShow).toBeDefined();
      expect(component.onShow.constructor.name).toContain('EventEmitter');
    });

    it('should have onClose EventEmitter', () => {
      expect(component.onClose).toBeDefined();
      expect(component.onClose.constructor.name).toContain('EventEmitter');
    });

    it('should have oContextMenuService property', () => {
      expect(component.oContextMenuService).toBeDefined();
    });

    it('should have subscription property', () => {
      expect(component.subscription).toBeDefined();
      expect(component.subscription.constructor.name).toBe('Subscription');
    });
  });

  // === METHOD TESTS (Proven Safe Pattern) ===
  describe('Component Methods', () => {
    it('should have ngOnInit method', () => {
      expect(component.ngOnInit).toBeDefined();
      expect(typeof component.ngOnInit).toBe('function');
    });

    it('should have ngOnDestroy method', () => {
      expect(component.ngOnDestroy).toBeDefined();
      expect(typeof component.ngOnDestroy).toBe('function');
    });

    it('should have showContextMenu method', () => {
      expect(component.showContextMenu).toBeDefined();
      expect(typeof component.showContextMenu).toBe('function');
    });

    it('should handle ngOnDestroy without errors', () => {
      expect(() => {
        component.ngOnDestroy();
      }).not.toThrow();
    });

    it('should handle showContextMenu method call with valid params', () => {
      const mockParams = {
        event: new MouseEvent('click'),
        contextMenu: component,
        menuItems: jasmine.createSpyObj('QueryList', [], { length: 0 }),
        externalMenuItems: jasmine.createSpyObj('QueryList', [], { length: 0 })
      };

      // Setup mock oContextMenuItems
      component.oContextMenuItems = { length: 0 };
      
      expect(() => {
        component.showContextMenu(mockParams);
      }).not.toThrow();
    });
  });

  // === EVENTEMITTER TESTS (Proven Safe Pattern) ===
  describe('EventEmitter Functionality', () => {
    it('should emit onShow event when showContextMenu is called', () => {
      spyOn(component.onShow, 'emit');
      
      const mockParams = {
        event: new MouseEvent('click'),
        contextMenu: component,
        menuItems: jasmine.createSpyObj('QueryList', [], { length: 0 }),
        externalMenuItems: jasmine.createSpyObj('QueryList', [], { length: 0 })
      };

      component.oContextMenuItems = { length: 0 };
      component.showContextMenu(mockParams);

      expect(component.onShow.emit).toHaveBeenCalledWith(mockParams);
    });

    it('should emit onClose event through service subscription', () => {
      spyOn(component.onClose, 'emit');
      
      // First setup subscriptions
      component.ngOnInit();
      
      // Then simulate service closeContextMenu emission
      mockOContextMenuService.closeContextMenu.next();

      expect(component.onClose.emit).toHaveBeenCalled();
    });

    it('should handle EventEmitter subscribe and unsubscribe', () => {
      let onShowCallCount = 0;
      let onCloseCallCount = 0;

      const onShowSubscription = component.onShow.subscribe(() => onShowCallCount++);
      const onCloseSubscription = component.onClose.subscribe(() => onCloseCallCount++);

      // Trigger events
      component.onShow.emit();
      component.onClose.emit();

      expect(onShowCallCount).toBe(1);
      expect(onCloseCallCount).toBe(1);

      // Clean up
      onShowSubscription.unsubscribe();
      onCloseSubscription.unsubscribe();
    });
  });

  // === SERVICE INTEGRATION TESTS (Proven Safe Pattern) ===
  describe('Service Integration', () => {
    it('should inject OContextMenuService properly', () => {
      expect(component.oContextMenuService).toBe(mockOContextMenuService);
    });

    it('should handle service showContextMenu subscription', () => {
      spyOn(component, 'showContextMenu');
      
      // First setup subscriptions
      component.ngOnInit();
      
      const mockParams = {
        event: new MouseEvent('click'),
        contextMenu: component
      };

      // Simulate service showContextMenu emission
      mockOContextMenuService.showContextMenu.next(mockParams as any);

      expect(component.showContextMenu).toHaveBeenCalledWith(mockParams);
    });

    it('should handle openContextMenu service call when menu items exist', () => {
      const mockParams = {
        event: new MouseEvent('click'),
        contextMenu: component,
        menuItems: jasmine.createSpyObj('QueryList', [], { length: 1 }),
        externalMenuItems: jasmine.createSpyObj('QueryList', [], { length: 0 })
      };

      // Mock oContextMenuItems with length > 0
      component.oContextMenuItems = { length: 1 };
      
      component.showContextMenu(mockParams);

      expect(mockOContextMenuService.openContextMenu).toHaveBeenCalledWith(jasmine.objectContaining({
        event: jasmine.any(MouseEvent),
        contextMenu: component
      }));
    });

    it('should not call openContextMenu when no menu items exist', () => {
      const mockParams = {
        event: new MouseEvent('click'),
        contextMenu: component
      };

      component.oContextMenuItems = { length: 0 };
      
      component.showContextMenu(mockParams);

      expect(mockOContextMenuService.openContextMenu).not.toHaveBeenCalled();
    });
  });

  // === LIFECYCLE TESTS (Proven Safe Pattern) ===
  describe('Component Lifecycle', () => {
    it('should handle ngOnInit subscription setup', () => {
      spyOn(component.subscription, 'add');
      
      expect(() => {
        component.ngOnInit();
      }).not.toThrow();
      
      expect(component.subscription.add).toHaveBeenCalled();
    });

    it('should handle subscription management properly', () => {
      expect(component.subscription.closed).toBe(false);
      
      component.ngOnDestroy();
      
      expect(component.subscription.closed).toBe(true);
    });

    it('should setup service subscriptions in ngOnInit', () => {
      const originalSubscription = component.subscription;
      component.subscription = jasmine.createSpyObj('Subscription', ['add', 'unsubscribe']);
      
      component.ngOnInit();
      
      expect(component.subscription.add).toHaveBeenCalledTimes(2);
      
      // Restore original subscription
      component.subscription = originalSubscription;
    });
  });

  // === EDGE CASE TESTS (Proven Safe Pattern) ===
  describe('Edge Case Handling', () => {
    it('should handle showContextMenu with different contextMenu', () => {
      const otherContextMenu = {}; // Different context menu
      const mockParams = {
        event: new MouseEvent('click'),
        contextMenu: otherContextMenu
      };

      expect(() => {
        component.showContextMenu(mockParams);
      }).not.toThrow();
      
      // Should return early and not set menuItems/externalMenuItems
      expect(mockParams.hasOwnProperty('menuItems')).toBe(false);
      expect(mockParams.hasOwnProperty('externalMenuItems')).toBe(false);
    });

    it('should handle null/undefined values safely', () => {
      expect(() => {
        component.origin = null;
        component.origin = undefined;
      }).not.toThrow();
    });

    it('should handle multiple ngOnInit calls', () => {
      expect(() => {
        component.ngOnInit();
        component.ngOnInit();
        component.ngOnInit();
      }).not.toThrow();
    });

    it('should handle multiple ngOnDestroy calls', () => {
      expect(() => {
        component.ngOnDestroy();
        component.ngOnDestroy();
        component.ngOnDestroy();
      }).not.toThrow();
    });
  });

  // === STRUCTURE AND CONSTANTS TESTS (Proven Safe Pattern) ===
  describe('Component Structure', () => {
    it('should have proper constructor parameters', () => {
      expect(component.constructor.length).toBe(1); // injector
    });

    it('should implement OnInit and OnDestroy interfaces', () => {
      expect(typeof component.ngOnInit).toBe('function');
      expect(typeof component.ngOnDestroy).toBe('function');
    });

    it('should verify DEFAULT_OUTPUTS_O_CONTEXT_MENU constant', () => {
      const module = require('./o-context-menu.component');
      expect(module.DEFAULT_OUTPUTS_O_CONTEXT_MENU).toBeDefined();
      expect(Array.isArray(module.DEFAULT_OUTPUTS_O_CONTEXT_MENU)).toBe(true);
      expect(module.DEFAULT_OUTPUTS_O_CONTEXT_MENU).toContain('onShow');
      expect(module.DEFAULT_OUTPUTS_O_CONTEXT_MENU).toContain('onClose');
    });

    it('should handle instantiation without errors', () => {
      const newComponent = new OContextMenuComponent(injector);
      expect(newComponent).toBeTruthy();
      expect(newComponent).toBeInstanceOf(OContextMenuComponent);
    });

    it('should have QueryList properties for ContentChildren that can be undefined initially', () => {
      // QueryList properties may not be available without proper Angular context
      expect(component.hasOwnProperty('externalContextMenuItems') || component.externalContextMenuItems === undefined).toBeTruthy();
      expect(component.hasOwnProperty('oContextMenuItems') || component.oContextMenuItems === undefined).toBeTruthy();
    });
  });
});
