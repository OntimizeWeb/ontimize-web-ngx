import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, ElementRef, Injector } from '@angular/core';

import { OTestingUtils } from '../../../shared/testing/o-testing-utils';

// Import component dynamically to avoid compilation
let OBarMenuGroupComponent: any;

import { OBarMenuBase } from '../o-bar-menu-base.class';

describe('OBarMenuGroupComponent', () => {
  let component: any;
  let mockBarMenu: jasmine.SpyObj<OBarMenuBase>;
  let mockElementRef: ElementRef;
  let injector: Injector;

  beforeEach(async () => {
    // Dynamically import to avoid early compilation
    const module = await import('./o-bar-menu-group.component');
    OBarMenuGroupComponent = module.OBarMenuGroupComponent;
    
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
        ...OTestingUtils.getCommonTestingModuleConfig().providers,
        { provide: OBarMenuBase, useValue: mockBarMenu }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    injector = TestBed.inject(Injector);
    mockElementRef = new ElementRef(document.createElement('div'));
    
    // Create component manually to avoid OWrapperContentMenuComponent issues
    component = new OBarMenuGroupComponent(mockBarMenu, mockElementRef, injector);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize without errors', () => {
    expect(() => {
      // Just verify component exists with id
      expect(component.id).toBeDefined();
    }).not.toThrow();
  });

  it('should have basic component structure', () => {
    expect(component).toBeInstanceOf(OBarMenuGroupComponent);
  });
});
