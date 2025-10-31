import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { OComboRendererBooleanComponent } from './o-combo-renderer-boolean.component';
import { OTestingUtils } from '../../../../../shared/testing/o-testing-utils';
import { OComboModule } from '../../o-combo.module';
import { OContextMenuModule } from '../../../..';

describe('OComboRendererBooleanComponent', () => {
  let component: OComboRendererBooleanComponent;
  let fixture: ComponentFixture<OComboRendererBooleanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OComboRendererBooleanComponent, ...OTestingUtils.getCommonDeclarations()],
      imports: [
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        ...OTestingUtils.getCommonTestingModuleConfig().imports,
        OContextMenuModule,
        OComboModule
      ],
      providers: [
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(OComboRendererBooleanComponent);
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
    expect(component).toBeInstanceOf(OComboRendererBooleanComponent);
  });
});
