import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Injector } from '@angular/core';

import { OContextMenuContentComponent } from './o-context-menu-content.component';
import { OTestingUtils } from '../../../shared/testing/o-testing-utils';

describe('OContextMenuContentComponent', () => {
  let component: OContextMenuContentComponent;
  let injector: Injector;

  beforeEach(async () => {
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
    
    // Create component manually to avoid ViewChild and lifecycle issues
    component = new OContextMenuContentComponent(injector);
    
    // Initialize QueryList properties with toArray method
    component.menuItems = { 
      changes: { subscribe: jasmine.createSpy() },
      toArray: jasmine.createSpy('toArray').and.returnValue([])
    } as any;
    component.externalMenuItems = { 
      changes: { subscribe: jasmine.createSpy() },
      toArray: jasmine.createSpy('toArray').and.returnValue([])
    } as any;
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
    expect(component).toBeInstanceOf(OContextMenuContentComponent);
  });
});
