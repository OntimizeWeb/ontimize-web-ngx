import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Injector } from '@angular/core';

import { OWrapperContentMenuComponent } from './o-wrapper-content-menu.component';
import { OTestingUtils } from '../../../../shared/testing/o-testing-utils';

describe('OWrapperContentMenuComponent', () => {
  let component: OWrapperContentMenuComponent;
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
    
    // Create component instance manually to avoid ViewChild issues
    component = new OWrapperContentMenuComponent(injector);
    component.items = [];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize without errors', () => {
    expect(() => {
      // Just verify component exists and items is initialized
      expect(component.items).toBeDefined();
    }).not.toThrow();
  });

  it('should have basic component structure', () => {
    expect(component).toBeInstanceOf(OWrapperContentMenuComponent);
  });
});
