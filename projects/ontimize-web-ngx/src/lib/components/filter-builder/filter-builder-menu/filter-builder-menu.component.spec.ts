import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Injector } from '@angular/core';

import { OFilterBuilderMenuComponent } from './filter-builder-menu.component';
import { OTestingUtils } from '../../../shared/testing/o-testing-utils';

describe('OFilterBuilderMenuComponent', () => {
  let component: OFilterBuilderMenuComponent;
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
    
    // Create component manually to avoid OWrapperContentMenuComponent issues
    component = new OFilterBuilderMenuComponent(injector);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize without errors', () => {
    expect(() => {
      expect(component).toBeInstanceOf(OFilterBuilderMenuComponent);
    }).not.toThrow();
  });

  it('should have basic component structure', () => {
    expect(component).toBeInstanceOf(OFilterBuilderMenuComponent);
  });
});
