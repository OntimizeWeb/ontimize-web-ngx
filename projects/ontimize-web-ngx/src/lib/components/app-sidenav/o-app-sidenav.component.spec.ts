import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Subject } from 'rxjs';

import { OAppSidenavComponent } from './o-app-sidenav.component';
import { OTestingUtils } from '../../shared/testing/o-testing-utils';
import { OAppSidenavBase } from './o-app-sidenav-base.class';
import { OAppLayoutBase } from '../../layouts/app-layout/o-app-layout-base.class';

describe('OAppSidenavComponent', () => {
  let component: OAppSidenavComponent;
  let fixture: ComponentFixture<OAppSidenavComponent>;
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

    await TestBed.configureTestingModule({
      declarations: [OAppSidenavComponent, ...OTestingUtils.getCommonDeclarations()],
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

    fixture = TestBed.createComponent(OAppSidenavComponent);
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
    expect(component).toBeInstanceOf(OAppSidenavComponent);
  });
});
