import { Subject } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { OAppSidenavMenuItemComponent } from './o-app-sidenav-menu-item.component';
import { OTestingUtils } from '../../../shared/testing/o-testing-utils';
import { OAppSidenavBase } from '../o-app-sidenav-base.class';
import { OAppLayoutBase } from '../../../layouts/app-layout/o-app-layout-base.class';

describe('OAppSidenavMenuItemComponent', () => {
  let component: OAppSidenavMenuItemComponent;
  let fixture: ComponentFixture<OAppSidenavMenuItemComponent>;
  let mockSidenav: jasmine.SpyObj<OAppSidenavBase>;
  let mockAppLayout: jasmine.SpyObj<OAppLayoutBase>;

  beforeEach(async () => {
    // Create mock for OAppSidenavBase
    mockSidenav = jasmine.createSpyObj('OAppSidenavBase', [], {
      onSidenavClosedStart: new Subject(),
      onSidenavOpenedStart: new Subject(),
      sidenav: {
        opened: false
      }
    });

    // Create mock for OAppLayoutBase
    mockAppLayout = jasmine.createSpyObj('OAppLayoutBase', [], {
      tooltipDisplayMode: 'only-collapsed'
    });

    await TestBed.configureTestingModule({
      declarations: [OAppSidenavMenuItemComponent, ...OTestingUtils.getCommonDeclarations()],
      imports: [
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        ...OTestingUtils.getCommonTestingModuleConfig().providers,
        { provide: OAppSidenavBase, useValue: mockSidenav },
        { provide: OAppLayoutBase, useValue: mockAppLayout }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(OAppSidenavMenuItemComponent);
    component = fixture.componentInstance;
    
    // Initialize menuItem to prevent 'Cannot read properties of undefined (reading id)'
    component.menuItem = { id: 'test-menu-item' } as any;
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
    expect(component).toBeInstanceOf(OAppSidenavMenuItemComponent);
  });
});
