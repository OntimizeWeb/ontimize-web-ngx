import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { OGridComponent } from './o-grid.component';
import { OTestingUtils } from '../../shared/testing/o-testing-utils';

describe('OGridComponent', () => {
  let component: OGridComponent;
  let fixture: ComponentFixture<OGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OGridComponent, ...OTestingUtils.getCommonDeclarations()],
      imports: [
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .overrideComponent(OGridComponent, {
      set: {
        template: '<div></div>' // Override template to avoid ContentChildren/ViewChild issues
      }
    }).compileComponents();

    fixture = TestBed.createComponent(OGridComponent);
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
    expect(component).toBeInstanceOf(OGridComponent);
  });
});
