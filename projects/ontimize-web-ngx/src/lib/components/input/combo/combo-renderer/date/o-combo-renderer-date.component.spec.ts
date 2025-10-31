import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { OComboRendererDateComponent } from './o-combo-renderer-date.component';
import { OTestingUtils } from '../../../../../shared/testing/o-testing-utils';
import { OComboModule } from '../../o-combo.module';
import { OContextMenuModule } from '../../../../contextmenu';

describe('OComboRendererDateComponent', () => {
  let component: OComboRendererDateComponent;
  let fixture: ComponentFixture<OComboRendererDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OComboRendererDateComponent, ...OTestingUtils.getCommonDeclarations()],
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

    fixture = TestBed.createComponent(OComboRendererDateComponent);
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
    expect(component).toBeInstanceOf(OComboRendererDateComponent);
  });
});
