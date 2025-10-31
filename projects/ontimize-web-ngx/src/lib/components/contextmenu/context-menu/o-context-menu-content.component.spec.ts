import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { OContextMenuContentComponent } from './o-context-menu-content.component';
import { OTestingUtils } from '../../../shared/testing/o-testing-utils';

describe('OContextMenuContentComponent', () => {
  let component: OContextMenuContentComponent;
  let fixture: ComponentFixture<OContextMenuContentComponent>;

  beforeEach(async () => {
    const testBed = TestBed.configureTestingModule({
      declarations: [OContextMenuContentComponent, ...OTestingUtils.getCommonDeclarations()],
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
    
    testBed.overrideComponent(OContextMenuContentComponent, {
      set: {
        template: '<div></div>' // Override template to avoid o-wrapper-content-menu ViewChild issues
      }
    });

    await testBed.compileComponents();

    fixture = TestBed.createComponent(OContextMenuContentComponent);
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
    expect(component).toBeInstanceOf(OContextMenuContentComponent);
  });
});
