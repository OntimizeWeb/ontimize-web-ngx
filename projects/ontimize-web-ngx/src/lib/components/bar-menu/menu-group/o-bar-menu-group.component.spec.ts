import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { OBarMenuGroupComponent } from './o-bar-menu-group.component';
import { OTestingUtils } from '../../../shared/testing/o-testing-utils';
import { OBarMenuBase } from '../o-bar-menu-base.class';

describe('OBarMenuGroupComponent', () => {
  let component: OBarMenuGroupComponent;
  let fixture: ComponentFixture<OBarMenuGroupComponent>;
  let mockBarMenu: jasmine.SpyObj<OBarMenuBase>;

  beforeEach(async () => {
    // Create mock for OBarMenuBase
    mockBarMenu = jasmine.createSpyObj('OBarMenuBase', 
      ['getPermissionsService', 'collapseAll', 'ngOnInit', 'setDOMTitle'], 
      {
        menuTitle: 'Test Menu',
        tooltip: 'Test Tooltip',
        id: 'test-menu',
        menuItems: []
      }
    );

    await TestBed.configureTestingModule({
      declarations: [OBarMenuGroupComponent, ...OTestingUtils.getCommonDeclarations()],
      imports: [
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        ...OTestingUtils.getCommonTestingModuleConfig().providers,
        { provide: OBarMenuBase, useValue: mockBarMenu }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(OBarMenuGroupComponent);
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
    expect(component).toBeInstanceOf(OBarMenuGroupComponent);
  });
});
