import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { ODualListSelectorDateItemComponent } from './o-dual-list-selector-date-item.component';
import { OTestingUtils } from '../../../../shared/testing/o-testing-utils';

describe('ODualListSelectorDateItemComponent', () => {
  let component: ODualListSelectorDateItemComponent;
  let fixture: ComponentFixture<ODualListSelectorDateItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ODualListSelectorDateItemComponent],
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

    fixture = TestBed.createComponent(ODualListSelectorDateItemComponent);
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
    expect(component).toBeInstanceOf(ODualListSelectorDateItemComponent);
  });
});
