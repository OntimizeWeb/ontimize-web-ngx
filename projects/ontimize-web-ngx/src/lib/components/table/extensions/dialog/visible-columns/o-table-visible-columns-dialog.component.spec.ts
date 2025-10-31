import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { OTableVisibleColumnsDialogComponent } from './o-table-visible-columns-dialog.component';
import { OTestingUtils } from '../../../../../shared/testing/o-testing-utils';

describe('OTableVisibleColumnsDialogComponent', () => {
  let component: OTableVisibleColumnsDialogComponent;
  let fixture: ComponentFixture<OTableVisibleColumnsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OTableVisibleColumnsDialogComponent, ...OTestingUtils.getCommonDeclarations()],
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

    fixture = TestBed.createComponent(OTableVisibleColumnsDialogComponent);
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
    expect(component).toBeInstanceOf(OTableVisibleColumnsDialogComponent);
  });
});
