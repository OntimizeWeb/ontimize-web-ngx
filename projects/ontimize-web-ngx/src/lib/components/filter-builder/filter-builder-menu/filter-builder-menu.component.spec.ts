import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { OFilterBuilderMenuComponent } from './filter-builder-menu.component';
import { OTestingUtils } from '../../../shared/testing/o-testing-utils';

describe('OFilterBuilderMenuComponent', () => {
  let component: OFilterBuilderMenuComponent;
  let fixture: ComponentFixture<OFilterBuilderMenuComponent>;

  beforeEach(async () => {
    const testBed = TestBed.configureTestingModule({
      declarations: [OFilterBuilderMenuComponent, ...OTestingUtils.getCommonDeclarations()],
      imports: [
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    
    testBed.overrideComponent(OFilterBuilderMenuComponent, {
      set: {
        template: '<div></div>' // Override template to avoid matMenu dependencies
      }
    });

    await testBed.compileComponents();

    fixture = TestBed.createComponent(OFilterBuilderMenuComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize without errors', () => {
    expect(() => {
      fixture.detectChanges();
    }).not.toThrow();
  });

  it('should have basic component structure', () => {
    expect(component).toBeInstanceOf(OFilterBuilderMenuComponent);
  });
});
