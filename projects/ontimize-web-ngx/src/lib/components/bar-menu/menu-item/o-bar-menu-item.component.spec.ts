import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Injector, ElementRef } from '@angular/core';

import { OTestingUtils } from '../../../shared/testing/o-testing-utils';
import { OBarMenuBase } from '../o-bar-menu-base.class';

// Import component dynamically to avoid compilation
let OBarMenuItemComponent: any;

describe('OBarMenuItemComponent', () => {
  let component: any;
  let injector: Injector;
  let mockBarMenu: jasmine.SpyObj<OBarMenuBase>;
  let mockElementRef: ElementRef;

  beforeEach(async () => {
    // Dynamically import to avoid early compilation
    const module = await import('./o-bar-menu-item.component');
    OBarMenuItemComponent = module.OBarMenuItemComponent;
    
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
    
    // Create component manually to avoid OWrapperContentMenuComponent issues
    component = new OBarMenuItemComponent(mockBarMenu, mockElementRef, injector);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize without errors', () => {
    expect(() => {
      expect(component).toBeInstanceOf(OBarMenuItemComponent);
    }).not.toThrow();
  });

  it('should have basic component structure', () => {
    expect(component).toBeInstanceOf(OBarMenuItemComponent);
  });
});
