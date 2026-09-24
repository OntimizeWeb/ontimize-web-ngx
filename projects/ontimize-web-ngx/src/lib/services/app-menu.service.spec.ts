import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { AppMenuService } from './app-menu.service';
import { AppConfig } from '../config/app-config';
import { MenuSection } from '../interfaces/app-menu.interface';
import { MenuRootItem } from '../types/menu-root-item.type';
import { OPermissions } from '../types/o-permissions.type';
import { PermissionsService } from './permissions/permissions.service';
import { OTestingUtils } from '../shared/testing/o-testing-utils';

describe('AppMenuService', () => {
  let service: AppMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        AppMenuService,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(AppMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of AppMenuService', () => {
    expect(service).toBeInstanceOf(AppMenuService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});

describe('AppMenuService menu sections', () => {

  const SECTION_MENU_CONFIG: MenuRootItem[] = [
    {
      id: 'block1',
      name: 'BLOCK 1',
      type: 'section',
      items: [
        { id: 'home', name: 'Home', route: '/home' },
        {
          id: 'customers',
          name: 'Customers',
          items: [{ id: 'customers-list', name: 'List', route: '/customers' }]
        }
      ]
    },
    { id: 'settings', name: 'Settings', route: '/settings' }
  ];

  let menuConfig: MenuRootItem[];
  let menuPermissions: OPermissions[];

  const appConfigStub = {
    getMenuConfiguration: () => menuConfig
  };

  const routerStub = {
    events: new Subject<any>(),
    url: '/'
  };

  const permissionsServiceStub = {
    onChangePermissions: new Subject<any>(),
    getAllMenuPermissions: () => menuPermissions,
    getMenuPermissions: (attr: string) => menuPermissions.find(permission => permission.attr === attr)
  };

  const createService = (configuration: MenuRootItem[]): AppMenuService => {
    menuConfig = configuration;
    return TestBed.runInInjectionContext(() => new AppMenuService());
  };

  const getSection = (service: AppMenuService, id: string): MenuSection =>
    service.getMenuRootById(id) as MenuSection;

  beforeEach(() => {
    menuPermissions = [];
    TestBed.configureTestingModule({
      providers: [
        { provide: AppConfig, useValue: appConfigStub },
        { provide: Router, useValue: routerStub },
        { provide: PermissionsService, useValue: permissionsServiceStub }
      ]
    });
  });

  it('#getMenuItemType should return "section" for an entry declaring type "section"', () => {
    const service = createService(SECTION_MENU_CONFIG);
    expect(service.getMenuItemType(getSection(service, 'block1'))).toBe('section');
    expect(service.isMenuSection(getSection(service, 'block1'))).toBe(true);
    expect(service.isMenuGroup(getSection(service, 'block1'))).toBe(false);
  });

  it('#getMenuItemType should keep returning "group" for the entries without an explicit type', () => {
    const service = createService(SECTION_MENU_CONFIG);
    const group = getSection(service, 'block1').items[1];
    expect(service.getMenuItemType(group)).toBe('group');
  });

  it('should include the section and all its descendants in the menu items', () => {
    const service = createService(SECTION_MENU_CONFIG);
    const ids = service.getAllMenuItems().map(item => item.id);
    expect(ids).toContain('block1');
    expect(ids).toContain('home');
    expect(ids).toContain('customers');
    expect(ids).toContain('customers-list');
  });

  it('should not modify the original menu configuration when merging the permissions', () => {
    const service = createService(SECTION_MENU_CONFIG);
    menuPermissions = [{ attr: 'home', visible: false, enabled: true }];
    service.mergeMenuItemsWithPermissions();
    expect(getSection(service, 'block1').items[0].visible).toBe(false);
    expect((SECTION_MENU_CONFIG[0] as MenuSection).items[0].visible).toBeUndefined();
  });

  describe('#isSectionVisible', () => {

    it('should be visible when at least one of its items is visible', () => {
      const service = createService(SECTION_MENU_CONFIG);
      menuPermissions = [{ attr: 'home', visible: false, enabled: true }];
      expect(service.isSectionVisible(getSection(service, 'block1'))).toBe(true);
    });

    it('should be hidden when all of its items are hidden', () => {
      const service = createService(SECTION_MENU_CONFIG);
      menuPermissions = [
        { attr: 'home', visible: false, enabled: true },
        { attr: 'customers', visible: false, enabled: true }
      ];
      expect(service.isSectionVisible(getSection(service, 'block1'))).toBe(false);
    });

    it('should be hidden when the section itself is hidden by permissions', () => {
      const service = createService(SECTION_MENU_CONFIG);
      menuPermissions = [{ attr: 'block1', visible: false, enabled: true }];
      expect(service.isSectionVisible(getSection(service, 'block1'))).toBe(false);
    });

    it('should ignore the "enabled" permission', () => {
      const service = createService(SECTION_MENU_CONFIG);
      menuPermissions = [{ attr: 'block1', visible: true, enabled: false }];
      expect(service.isSectionVisible(getSection(service, 'block1'))).toBe(true);
    });

    it('should be hidden when it has no items', () => {
      const service = createService([{ id: 'empty', name: 'EMPTY', type: 'section', items: [] }]);
      expect(service.isSectionVisible(getSection(service, 'empty'))).toBe(false);
    });

  });

  it('should warn about the sections that are not placed at the root level', () => {
    spyOn(console, 'warn');
    createService([
      {
        id: 'group',
        name: 'Group',
        items: [{ id: 'nested-block', name: 'NESTED', type: 'section', items: [] }]
      }
    ]);
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect((console.warn as jasmine.Spy).calls.argsFor(0)[0]).toContain('nested-block');
  });

});
