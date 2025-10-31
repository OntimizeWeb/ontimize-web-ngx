import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OFilterBuilderComponent } from './o-filter-builder.component';
import { OTestingUtils } from '../../shared/testing/o-testing-utils';
import { OFormComponent } from '../form/o-form.component';
import { OFilterBuilderComponentStateService } from '../../services/state/o-filter-builder-component-state.service';

describe('OFilterBuilderComponent', () => {
  let component: OFilterBuilderComponent;
  let fixture: ComponentFixture<OFilterBuilderComponent>;
  let mockOFormComponent: jasmine.SpyObj<OFormComponent>;
  let mockStateService: jasmine.SpyObj<OFilterBuilderComponentStateService>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    // Create mock for OFormComponent
    mockOFormComponent = jasmine.createSpyObj('OFormComponent', [
      'registerFormComponent',
      'unregisterFormComponent',
      'setFormData'
    ]);

    // Create mock for OFilterBuilderComponentStateService
    mockStateService = jasmine.createSpyObj('OFilterBuilderComponentStateService', [
      'getState',
      'setState',
      'initialize'
    ]);

    // Create mock for ActivatedRoute
    mockActivatedRoute = jasmine.createSpyObj('ActivatedRoute', [], {
      params: of({}),
      queryParams: of({}),
      snapshot: { params: {}, queryParams: {} }
    });

    await TestBed.configureTestingModule({
      declarations: [OFilterBuilderComponent, ...OTestingUtils.getCommonDeclarations()],
      imports: [
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        { provide: OFormComponent, useValue: mockOFormComponent },
        { provide: OFilterBuilderComponentStateService, useValue: mockStateService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(OFilterBuilderComponent);
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
    expect(component).toBeInstanceOf(OFilterBuilderComponent);
  });
});
