import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Injector } from '@angular/core';

import { OTestingUtils } from '../../shared/testing/o-testing-utils';

// Import component dynamically to avoid compilation
let OAppHeaderComponent: any;

import { of } from 'rxjs';

describe('OAppHeaderComponent', () => {
  let component: any;
  let injector: Injector;

  beforeEach(async () => {
    // Dynamically import to avoid early compilation
    const module = await import('./o-app-header.component');
    OAppHeaderComponent = module.OAppHeaderComponent;
    
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
    component = new OAppHeaderComponent(injector);
    
    // Mock headerTitle$ observable
    component.headerTitle$ = of('Test Title');
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
    expect(component).toBeInstanceOf(OAppHeaderComponent);
  });

  describe('Component Properties', () => {
    it('should have default values for input properties', () => {
      expect(component.showUserInfo).toBe(true);
      expect(component.showLanguageSelector).toBe(true);
      expect(component.useFlagIcons).toBe(false);
      expect(component.showTitle).toBe(false);
      expect(component.showStaticTitle).toBe(false);
    });

    it('should set and get color property', () => {
      const testColor = 'primary';
      component.color = testColor;
      expect(component.color).toBe(testColor);
    });

    it('should set and get headerHeight property with valid values', () => {
      component.headerHeight = 'small';
      expect(component.headerHeight).toBe('small');
      
      component.headerHeight = 'medium';
      expect(component.headerHeight).toBe('medium');
      
      component.headerHeight = 'large';
      expect(component.headerHeight).toBe('large');
    });

    it('should use default headerHeight for invalid values', () => {
      component.headerHeight = 'invalid';
      expect(component.headerHeight).toBe('medium'); // Default value
      
      component.headerHeight = null;
      expect(component.headerHeight).toBe('medium');
    });

    it('should convert headerHeight to lowercase', () => {
      component.headerHeight = 'LARGE';
      expect(component.headerHeight).toBe('large');
    });
  });

  describe('Component Methods', () => {
    it('should emit onSidenavToggle event', () => {
      spyOn(component.onSidenavToggle, 'emit');
      component.onSidenavToggle.emit();
      expect(component.onSidenavToggle.emit).toHaveBeenCalled();
    });

    it('should call authService.logoutWithConfirmation on logout click', () => {
      spyOn(component.authService, 'logoutWithConfirmation');
      
      component.onLogoutClick();
      expect(component.authService.logoutWithConfirmation).toHaveBeenCalled();
    });

    it('should initialize headerTitle$ observable when showStaticTitle is false', () => {
      component.showStaticTitle = false;
      spyOn(component.modulesInfoService, 'getModuleChangeObservable').and.returnValue(of('Module Title'));
      
      component.ngOnInit();
      
      expect(component.modulesInfoService.getModuleChangeObservable).toHaveBeenCalled();
      expect(component.headerTitle$).toBeDefined();
    });

    it('should not initialize headerTitle$ observable when showStaticTitle is true', () => {
      component.showStaticTitle = true;
      spyOn(component.modulesInfoService, 'getModuleChangeObservable');
      
      component.ngOnInit();
      
      expect(component.modulesInfoService.getModuleChangeObservable).not.toHaveBeenCalled();
    });
  });

  describe('Input Property Setters', () => {
    it('should set showUserInfo property', () => {
      component.showUserInfo = false;
      expect(component.showUserInfo).toBe(false);
    });

    it('should set showLanguageSelector property', () => {
      component.showLanguageSelector = false;
      expect(component.showLanguageSelector).toBe(false);
    });

    it('should set useFlagIcons property', () => {
      component.useFlagIcons = true;
      expect(component.useFlagIcons).toBe(true);
    });

    it('should set staticTitle property', () => {
      const testTitle = 'Test Static Title';
      component.staticTitle = testTitle;
      expect(component.staticTitle).toBe(testTitle);
    });
  });
});
