import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { OTableCellEditorBooleanComponent } from './o-table-cell-editor-boolean.component';
import { OTestingUtils } from '../../../../../shared/testing/o-testing-utils';

describe('OTableCellEditorBooleanComponent', () => {
  let component: OTableCellEditorBooleanComponent;
  let fixture: ComponentFixture<OTableCellEditorBooleanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OTableCellEditorBooleanComponent],
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

    fixture = TestBed.createComponent(OTableCellEditorBoolean.component);
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
    expect(component).toBeInstanceOf(OTableCellEditorBooleanComponent);
  });
});
