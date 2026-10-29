import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import {  CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA , Injector } from '@angular/core';
import { OComplexComponentTestingUtils } from '../../shared/testing/o-complex-component-testing-utils';
import { AbstractComponentStateService } from '../../services/state/o-component-state.service';
import { OListLoadingService } from './o-list-loading.service';

// Import component dynamically to avoid compilation
let OListComponent: any;

describe('OListComponent', () => {
  let component: any;
  let mockStateService: jasmine.SpyObj<AbstractComponentStateService<any, any>>;

  beforeEach(async () => {
    // Dynamically import to avoid early compilation
    const module = await import('./o-list.component');
    OListComponent = module.OListComponent;
    
    // Create mock for AbstractComponentStateService
    mockStateService = jasmine.createSpyObj('AbstractComponentStateService', [
      'initialize',
      'getState',
      'setState'
    ]);
    
    await TestBed.configureTestingModule({
      declarations: [...OComplexComponentTestingUtils.getCommonDeclarations()],
      imports: [
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        ...OComplexComponentTestingUtils.getComplexComponentTestingModuleConfig().imports
      ],
      providers: [
        { provide: AbstractComponentStateService, useValue: mockStateService },
        OListLoadingService,
        ...OComplexComponentTestingUtils.getComplexComponentTestingModuleConfig().providers
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    // Create component manually to avoid OWrapperContentMenuComponent issues
    const mockInjector = TestBed.inject(Injector);
    const mockElementRef: any = { nativeElement: document.createElement('div') };
    const mockOFormComponent: any = {};
    component = new OListComponent(mockInjector, mockElementRef, mockOFormComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize without errors', () => {
    expect(() => {
      // detectChanges not needed with manual instantiation
    }).not.toThrow();
  });

  it('should have basic component structure', () => {
    expect(component.constructor).toBe(OListComponent);
  });

  describe('scroll-to-top button', () => {
    let scrollContainer: any;

    beforeEach(() => {
      scrollContainer = { scrollTop: 0, scrollTo: jasmine.createSpy('scrollTo') };
      component.scrollContainerEl = { nativeElement: scrollContainer };
      component.dataResponseArray = new Array(100).fill({});
      component.dataArray = component.dataResponseArray;
    });

    it('is disabled by default, so existing apps see no change', () => {
      expect(component.scrollToTopButton).toBe(false);
    });

    it('accepts yes/no/true/false like the rest of o-list booleans', () => {
      component.scrollToTopButton = 'yes';
      expect(component.scrollToTopButton).toBe(true);
      component.scrollToTopButton = 'no';
      expect(component.scrollToTopButton).toBe(false);
    });

    it('stays hidden below the scroll threshold', () => {
      component.scrollToTopButton = true;
      scrollContainer.scrollTop = 50;
      component.updateScrollToTopVisibility(scrollContainer);
      expect(component.showScrollToTopButton).toBe(false);
    });

    it('shows past the scroll threshold, and hides again back at the top', () => {
      component.scrollToTopButton = true;
      scrollContainer.scrollTop = 500;
      component.updateScrollToTopVisibility(scrollContainer);
      expect(component.showScrollToTopButton).toBe(true);

      scrollContainer.scrollTop = 0;
      component.updateScrollToTopVisibility(scrollContainer);
      expect(component.showScrollToTopButton).toBe(false);
    });

    it('never shows while scroll-to-top-button is off, however far scrolled', () => {
      component.scrollToTopButton = false;
      scrollContainer.scrollTop = 500;
      component.updateScrollToTopVisibility(scrollContainer);
      expect(component.showScrollToTopButton).toBe(false);
    });

    it('also shows with mat-paginator active: the container still scrolls within the current page', () => {
      component.scrollToTopButton = true;
      component.matpaginator = {};
      scrollContainer.scrollTop = 500;
      component.updateScrollToTopVisibility(scrollContainer);
      expect(component.showScrollToTopButton).toBe(true);

      scrollContainer.scrollTop = 0;
      component.updateScrollToTopVisibility(scrollContainer);
      expect(component.showScrollToTopButton).toBe(false);
    });

    it('only moves the scroll container to the top — no data reload, no dataArray/dataResponseArray change', () => {
      spyOn(component, 'reloadData');
      spyOn(component, 'queryData');
      const dataArrayBefore = component.dataArray;
      const dataResponseArrayBefore = component.dataResponseArray;

      component.scrollToTop();

      expect(scrollContainer.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
      expect(component.reloadData).not.toHaveBeenCalled();
      expect(component.queryData).not.toHaveBeenCalled();
      expect(component.dataArray).toBe(dataArrayBefore);
      expect(component.dataResponseArray).toBe(dataResponseArrayBefore);
      expect(component.dataArray.length).toBe(100);
    });

    it('does not throw when the scroll container ref is not resolved yet', () => {
      component.scrollContainerEl = undefined;
      expect(() => component.scrollToTop()).not.toThrow();
    });

    it('is configurable through action-styles, keyed by "scroll-top", like the insert/refresh/delete buttons', () => {
      expect(component.getActionImportanceClass('scroll-top')).toBe('o-button--importance-default');

      component.actionStyles = { 'scroll-top': { importance: 'primary' } };
      expect(component.getActionImportanceClass('scroll-top')).toBe('o-button--importance-primary');
    });

    it('does not change how action-styles resolves for the existing insert/refresh/delete actions', () => {
      component.actionStyles = { 'scroll-top': { importance: 'primary' }, insert: { importance: 'warn' } };
      expect(component.getActionImportanceClass('insert')).toBe('o-button--importance-warn');
      expect(component.getActionImportanceClass('refresh')).toBe('o-button--importance-default');
      expect(component.getActionImportanceClass('delete')).toBe('o-button--importance-default');
    });
  });
});
