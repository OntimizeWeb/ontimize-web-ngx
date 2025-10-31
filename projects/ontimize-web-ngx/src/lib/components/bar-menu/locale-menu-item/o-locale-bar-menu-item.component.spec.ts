import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, ElementRef, Injector } from '@angular/core';

import { OLocaleBarMenuItemComponent } from './o-locale-bar-menu-item.component';
import { OTestingUtils } from '../../../shared/testing/o-testing-utils';
import { OBarMenuBase } from '../o-bar-menu-base.class';

describe('OLocaleBarMenuItemComponent', () => {
  let component: OLocaleBarMenuItemComponent;
  let mockBarMenu: jasmine.SpyObj<OBarMenuBase>;
  let mockElementRef: ElementRef;
  let injector: Injector;

  beforeEach(async () => {
    // Create mock permissions service
    const mockPermissionsService = jasmine.createSpyObj('PermissionsService', ['getMenuPermissions']);
    mockPermissionsService.getMenuPermissions.and.returnValue(undefined);
    
    // Create mock for OBarMenuBase
    mockBarMenu = jasmine.createSpyObj('OBarMenuBase', 
      ['getPermissionsService', 'collapseAll', 'ngOnInit', 'setDOMTitle'], 
      {
        menuTitle: 'Test Menu',
        tooltip: 'Test Tooltip',
        id: 'test-menu',
        menuItems: []
      }
    );
    
    // Mock getPermissionsService to return the mock permissions service
    mockBarMenu.getPermissionsService.and.returnValue(mockPermissionsService);

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
    
    // Create component instance manually to avoid OWrapperContentMenuComponent ViewChild issues
    component = new OLocaleBarMenuItemComponent(mockBarMenu, mockElementRef, injector);
    component.locale = 'en';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize without errors', () => {
    expect(() => {
      // Just verify component exists and locale is initialized
      expect(component.locale).toBe('en');
    }).not.toThrow();
  });

  it('should have basic component structure', () => {
    expect(component).toBeInstanceOf(OLocaleBarMenuItemComponent);
  });

  it('should have locale property', () => {
    expect(component.locale).toBeDefined();
  });

  it('should set locale value', () => {
    const testLocale = 'es';
    component.locale = testLocale;
    expect(component.locale).toBe(testLocale);
  });

  it('should have access to menu', () => {
    expect(component['menu']).toBeTruthy();
    expect(component['menu']).toBe(mockBarMenu);
  });
});
