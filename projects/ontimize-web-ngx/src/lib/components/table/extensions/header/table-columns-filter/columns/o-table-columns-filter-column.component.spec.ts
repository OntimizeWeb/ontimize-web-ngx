import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { OTableColumnsFilterColumnComponent } from './o-table-columns-filter-column.component';
import { OTestingUtils } from '../../../../../../shared/testing/o-testing-utils';

describe('OTableColumnsFilterColumnComponent', () => {
  let component: OTableColumnsFilterColumnComponent;
  let fixture: ComponentFixture<OTableColumnsFilterColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OTableColumnsFilterColumnComponent, ...OTestingUtils.getCommonDeclarations()],
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

    fixture = TestBed.createComponent(OTableColumnsFilterColumnComponent);
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
    expect(component).toBeInstanceOf(OTableColumnsFilterColumnComponent);
  });
});
