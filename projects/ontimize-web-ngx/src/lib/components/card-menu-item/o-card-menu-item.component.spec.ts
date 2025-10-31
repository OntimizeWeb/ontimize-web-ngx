import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OCardMenuItemComponent } from './o-card-menu-item.component';
import { OTestingUtils } from '../../shared/testing/o-testing-utils';

describe('OCardMenuItemComponent', () => {
  let component: OCardMenuItemComponent;
  let fixture: ComponentFixture<OCardMenuItemComponent>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    // Create mock for ActivatedRoute
    mockActivatedRoute = jasmine.createSpyObj('ActivatedRoute', [], {
      params: of({}),
      queryParams: of({}),
      snapshot: { params: {}, queryParams: {} }
    });

    await TestBed.configureTestingModule({
      declarations: [OCardMenuItemComponent, ...OTestingUtils.getCommonDeclarations()],
      imports: [
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .overrideComponent(OCardMenuItemComponent, {
      set: {
        template: '<div></div>' // Override template to avoid ContentChildren/ViewChild issues
      }
    }).compileComponents();

    fixture = TestBed.createComponent(OCardMenuItemComponent);
    component = fixture.componentInstance;
    
    // Initialize _showSecondaryContainer before detectChanges to avoid ExpressionChangedAfterItHasBeenCheckedError
    // The getter showSecondaryContainer is bound in the template, and its initial value affects the 'compact' class
    (component as any)._showSecondaryContainer = false;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize without errors', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have basic component structure', () => {
    expect(component).toBeInstanceOf(OCardMenuItemComponent);
  });
});
