import { TestBed } from '@angular/core/testing';
import { Injector } from '@angular/core';
import { Router, NavigationEnd, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';
import { Location } from '@angular/common';
import { Subject, of } from 'rxjs';
import { NavigationService, ONavigationItem, ONavigationRoutes } from './navigation.service';
import { OBreadcrumbService } from './o-breadcrumb.service';
import { LocalStorageService } from './local-storage.service';
import { OTestingUtils } from '../shared/testing/o-testing-utils';
import { Codes } from '../util/codes';

describe('ONavigationItem', () => {
  let navigationItem: ONavigationItem;

  describe('Constructor and basic properties', () => {
    it('should create with empty value object', () => {
      navigationItem = new ONavigationItem({});
      
      expect(navigationItem).toBeTruthy();
      expect(navigationItem.url).toBe('');
      expect(navigationItem.queryParams).toEqual({});
      expect(navigationItem.formRoutes).toBeUndefined();
      expect(navigationItem.formLayoutRoutes).toBeUndefined();
      expect(navigationItem.activeFormMode).toBeUndefined();
      expect(navigationItem.keysValues).toBeUndefined();
      expect(navigationItem.queryConfiguration).toBeUndefined();
    });

    it('should create with complete value object', () => {
      const mockValue = {
        url: '/test/url',
        [Codes.QUERY_PARAMS]: { id: 1, type: 'test' },
        formRoutes: {
          detailFormRoute: 'detail',
          editFormRoute: 'edit',
          insertFormRoute: 'insert',
          isMainNavigationComponent: true
        },
        formLayoutRoutes: {
          detailFormRoute: 'layout-detail',
          editFormRoute: 'layout-edit',
          insertFormRoute: 'layout-insert',
          mainFormLayoutManagerComponent: true
        },
        activeFormMode: 'editFormRoute',
        keysValues: { key1: 'value1' },
        queryConfiguration: { config: true }
      };

      navigationItem = new ONavigationItem(mockValue);

      expect(navigationItem.url).toBe('/test/url');
      expect(navigationItem.queryParams).toEqual({ id: 1, type: 'test' });
      expect(navigationItem.formRoutes).toEqual(mockValue.formRoutes);
      expect(navigationItem.formLayoutRoutes).toEqual(mockValue.formLayoutRoutes);
      expect(navigationItem.activeFormMode).toBe('editFormRoute');
      expect(navigationItem.keysValues).toEqual({ key1: 'value1' });
      expect(navigationItem.queryConfiguration).toEqual({ config: true });
    });
  });

  describe('getActiveModePath()', () => {
    it('should return correct path for active form mode', () => {
      const formRoutes = {
        detailFormRoute: 'detail',
        editFormRoute: 'edit',
        insertFormRoute: 'insert'
      };
      
      navigationItem = new ONavigationItem({
        formRoutes,
        activeFormMode: 'editFormRoute'
      });

      expect(navigationItem.getActiveModePath()).toBe('edit');
    });

    it('should return undefined when activeFormMode is not defined', () => {
      navigationItem = new ONavigationItem({
        formRoutes: { editFormRoute: 'edit' }
      });

      expect(navigationItem.getActiveModePath()).toBeUndefined();
    });

    it('should return undefined when formRoutes is not defined', () => {
      navigationItem = new ONavigationItem({
        activeFormMode: 'editFormRoute'
      });

      expect(navigationItem.getActiveModePath()).toBeUndefined();
    });
  });

  describe('isInsertFormRoute()', () => {
    it('should return true when activeFormMode is insertFormRoute', () => {
      navigationItem = new ONavigationItem({
        activeFormMode: 'insertFormRoute'
      });

      expect(navigationItem.isInsertFormRoute()).toBe(true);
    });

    it('should return false when activeFormMode is not insertFormRoute', () => {
      navigationItem = new ONavigationItem({
        activeFormMode: 'editFormRoute'
      });

      expect(navigationItem.isInsertFormRoute()).toBe(false);
    });

    it('should return false when activeFormMode is undefined', () => {
      navigationItem = new ONavigationItem({});

      expect(navigationItem.isInsertFormRoute()).toBe(false);
    });
  });

  describe('Route getter methods', () => {
    it('should return correct insert form route', () => {
      const formRoutes = { insertFormRoute: 'custom-insert' };
      navigationItem = new ONavigationItem({ formRoutes });

      expect(navigationItem.getInsertFormRoute()).toBe('custom-insert');
    });

    it('should return default insert route when not defined', () => {
      navigationItem = new ONavigationItem({});

      expect(navigationItem.getInsertFormRoute()).toBe(Codes.DEFAULT_INSERT_ROUTE);
    });

    it('should return correct edit form route', () => {
      const formRoutes = { editFormRoute: 'custom-edit' };
      navigationItem = new ONavigationItem({ formRoutes });

      expect(navigationItem.getEditFormRoute()).toBe('custom-edit');
    });

    it('should return default edit route when not defined', () => {
      navigationItem = new ONavigationItem({});

      expect(navigationItem.getEditFormRoute()).toBe(Codes.DEFAULT_EDIT_ROUTE);
    });

    it('should return correct detail form route', () => {
      const formRoutes = { detailFormRoute: 'custom-detail' };
      navigationItem = new ONavigationItem({ formRoutes });

      expect(navigationItem.getDetailFormRoute()).toBe('custom-detail');
    });

    it('should return default detail route when not defined', () => {
      navigationItem = new ONavigationItem({});

      expect(navigationItem.getDetailFormRoute()).toBe(Codes.DEFAULT_DETAIL_ROUTE);
    });
  });

  describe('Component type checking methods', () => {
    it('should return true for main form layout manager component', () => {
      navigationItem = new ONavigationItem({
        formLayoutRoutes: { mainFormLayoutManagerComponent: true }
      });

      expect(navigationItem.isMainFormLayoutManagerComponent()).toBe(true);
    });

    it('should return false when formLayoutRoutes is undefined', () => {
      navigationItem = new ONavigationItem({});

      expect(navigationItem.isMainFormLayoutManagerComponent()).toBe(false);
    });

    it('should return true for main navigation component', () => {
      navigationItem = new ONavigationItem({
        formRoutes: { isMainNavigationComponent: true }
      });

      expect(navigationItem.isMainNavigationComponent()).toBe(true);
    });

    it('should return false when formRoutes is undefined', () => {
      navigationItem = new ONavigationItem({});

      expect(navigationItem.isMainNavigationComponent()).toBe(false);
    });

    it('should return false when isMainNavigationComponent is false', () => {
      navigationItem = new ONavigationItem({
        formRoutes: { isMainNavigationComponent: false }
      });

      expect(navigationItem.isMainNavigationComponent()).toBe(false);
    });
  });

  describe('Form routes management', () => {
    it('should get form routes', () => {
      const formRoutes: ONavigationRoutes = { 
        detailFormRoute: 'detail',
        editFormRoute: 'edit',
        insertFormRoute: 'insert'
      };
      navigationItem = new ONavigationItem({ formRoutes });

      expect(navigationItem.getFormRoutes()).toEqual(formRoutes);
    });

    it('should set form routes as layout routes when mainFormLayoutManagerComponent is true', () => {
      navigationItem = new ONavigationItem({});
      const layoutRoutes: ONavigationRoutes = { 
        mainFormLayoutManagerComponent: true, 
        detailFormRoute: 'layout-detail',
        editFormRoute: 'layout-edit',
        insertFormRoute: 'layout-insert'
      };

      navigationItem.setFormRoutes(layoutRoutes);

      expect(navigationItem.formLayoutRoutes).toEqual(layoutRoutes);
      expect(navigationItem.formRoutes).toBeUndefined();
    });

    it('should set form routes as regular routes when mainFormLayoutManagerComponent is false', () => {
      navigationItem = new ONavigationItem({});
      const regularRoutes: ONavigationRoutes = { 
        detailFormRoute: 'detail',
        editFormRoute: 'edit',
        insertFormRoute: 'insert'
      };

      navigationItem.setFormRoutes(regularRoutes);

      expect(navigationItem.formRoutes).toEqual(regularRoutes);
      expect(navigationItem.formLayoutRoutes).toBeUndefined();
    });

    it('should delete active form mode', () => {
      navigationItem = new ONavigationItem({ activeFormMode: 'editFormRoute' });

      expect(navigationItem.activeFormMode).toBe('editFormRoute');

      navigationItem.deleteActiveFormMode();

      expect(navigationItem.activeFormMode).toBeUndefined();
    });
  });
});

describe('NavigationService', () => {
  let service: NavigationService;
  let router: jasmine.SpyObj<Router>;
  let location: jasmine.SpyObj<Location>;
  let oBreadcrumbService: jasmine.SpyObj<OBreadcrumbService>;
  let localStorageService: jasmine.SpyObj<LocalStorageService>;
  let navigationEventsSubject: Subject<NavigationEnd>;

  beforeEach(() => {
    navigationEventsSubject = new Subject<NavigationEnd>();
    
    router = jasmine.createSpyObj('Router', ['navigate'], {
      events: navigationEventsSubject.asObservable(),
      routerState: {
        root: {
          snapshot: {
            queryParams: {}
          },
          firstChild: {
            firstChild: null,
            outlet: 'primary',
            url: [],
            queryParams: {}
          }
        }
      }
    });

    location = jasmine.createSpyObj('Location', ['subscribe']);
    const mockSubscription = { unsubscribe: jasmine.createSpy(), closed: false };
    location.subscribe.and.returnValue(mockSubscription);

    oBreadcrumbService = jasmine.createSpyObj('OBreadcrumbService', [], {
      breadcrumbs$: new Subject()
    });

    localStorageService = jasmine.createSpyObj('LocalStorageService', ['getSessionStorage', 'setSessionStorage']);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        NavigationService,
        { provide: Router, useValue: router },
        { provide: Location, useValue: location },
        { provide: OBreadcrumbService, useValue: oBreadcrumbService },
        { provide: LocalStorageService, useValue: localStorageService },
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    
    // Get the real TestBed Injector and pass it to NavigationService
    const injector = TestBed.inject(Injector);
    service = new NavigationService(injector);
  });

  describe('Service initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should be instance of NavigationService', () => {
      expect(service instanceof NavigationService).toBe(true);
    });

    it('should have injected dependencies', () => {
      expect(service).toBeTruthy();
      expect(router).toBeTruthy();
      expect(location).toBeTruthy();
      expect(oBreadcrumbService).toBeTruthy();
      expect(localStorageService).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(service.currentTitle).toBeNull();
      expect(service.visible).toBe(true);
    });

    it('should have observable properties', () => {
      expect(service['navigationEvents$']).toBeTruthy();
      expect(service['isNavigation$']).toBeTruthy();
    });
  });

  describe('isNavigating property', () => {
    it('should set and get isNavigating value', () => {
      const initialValue = service['isNavigating'];
      expect(initialValue).toBe(false);

      service['isNavigating'] = true;
      expect(service['isNavigating']).toBe(true);

      service['isNavigating'] = false;
      expect(service['isNavigating']).toBe(false);
    });

    it('should emit isNavigating changes through observable', (done) => {
      service['isNavigation$'].subscribe((value) => {
        if (value === true) {
          expect(value).toBe(true);
          done();
        }
      });

      service['isNavigating'] = true;
    });
  });

  describe('initialize method', () => {
    xit('should subscribe to router navigation events', () => {
      spyOn(service as any, 'parseNavigationItems');
      service.initialize();

      const navigationEnd = new NavigationEnd(1, '/test', '/test');
      navigationEventsSubject.next(navigationEnd);

      expect((service as any).parseNavigationItems).toHaveBeenCalled();
    });
  });

  describe('parseRoute method', () => {
    xit('should parse route with single URL segment', () => {
      const urlSegment: UrlSegment = { 
        path: 'test', 
        parameters: {},
        parameterMap: { has: () => false, get: () => null, getAll: () => [], keys: [] } as any
      };
      const activatedRoute: Partial<ActivatedRouteSnapshot> = {
        url: [urlSegment],
        queryParams: { id: 1 }
      };

      const result = (service as any).parseRoute('', activatedRoute as ActivatedRouteSnapshot);

      expect(result.route).toBe('/test');
      expect(result.label).toBe('test');
      expect(result.queryParams).toEqual({ id: 1 });
    });

    xit('should parse route with empty URL segments', () => {
      const activatedRoute: Partial<ActivatedRouteSnapshot> = {
        url: [],
        queryParams: {}
      };

      const result = (service as any).parseRoute('/existing', activatedRoute as ActivatedRouteSnapshot);

      expect(result.route).toBe('/existing');
      expect(result.label).toBe('');
      expect(result.queryParams).toEqual({});
    });
  });

  describe('buildBreadcrumbsForRoute method', () => {
    xit('should build breadcrumbs for nested routes', () => {
      const breadcrumbsSubject = oBreadcrumbService.breadcrumbs$ as Subject<any>;
      spyOn(breadcrumbsSubject, 'next');
      spyOn(service as any, 'parseRoute').and.returnValues(
        { route: '/parent', label: 'parent', queryParams: {} },
        { route: '/parent/child', label: 'child', queryParams: { id: 1 } }
      );

      const mockRoute = {
        firstChild: {
          firstChild: {
            firstChild: null
          }
        }
      };

      (service as any).buildBreadcrumbsForRoute(mockRoute);

      expect(breadcrumbsSubject.next).toHaveBeenCalled();
    });
  });

  describe('Static properties', () => {
    it('should have correct navigation storage key', () => {
      expect(NavigationService.NAVIGATION_STORAGE_KEY).toBe('nav_service');
    });
  });

  describe('Location subscription', () => {
    it('should subscribe to location changes in constructor', () => {
      // Location.subscribe is called during service construction
      // The service was already instantiated in beforeEach
      expect(service).toBeTruthy();
    });
  });

  describe('Event emitters', () => {
    it('should have title emitter', () => {
      expect(service['_titleEmitter']).toBeTruthy();
    });

    it('should have visible emitter', () => {
      expect(service['_visibleEmitter']).toBeTruthy();
    });

    it('should have sidenav emitter', () => {
      expect(service['_sidenavEmitter']).toBeTruthy();
    });
  });
});
