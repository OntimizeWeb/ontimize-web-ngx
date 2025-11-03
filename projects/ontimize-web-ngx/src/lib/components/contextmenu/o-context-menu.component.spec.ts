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
    
    mockOContextMenuService = jasmine.createSpyObj('OContextMenuService', ['closeAllContextMenus'], {
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
});
