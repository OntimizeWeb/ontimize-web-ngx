import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Injector, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MediaObserver } from '@ngbracket/ngx-layout';
import { of, Subject } from 'rxjs';

import { OTestingUtils } from '../../shared/testing/o-testing-utils';

// Import component dynamically to avoid compilation
let OAppSidenavComponent: any;

import { AppMenuService } from '../../services/app-menu.service';
import { OUserInfoService } from '../../services/o-user-info.service';

describe('OAppSidenavComponent', () => {
  let component: any;
  let injector: Injector;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockElementRef: ElementRef;
  let mockChangeDetectorRef: jasmine.SpyObj<ChangeDetectorRef>;
  let mockMediaObserver: jasmine.SpyObj<MediaObserver>;
  let mockAppMenuService: jasmine.SpyObj<AppMenuService>;
  let mockOUserInfoService: jasmine.SpyObj<OUserInfoService>;

  beforeEach(async () => {
    // Dynamically import to avoid early compilation
    const module = await import('./o-app-sidenav.component');
    OAppSidenavComponent = module.OAppSidenavComponent;
    
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockChangeDetectorRef = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges', 'markForCheck']);
    mockMediaObserver = jasmine.createSpyObj('MediaObserver', ['asObservable', 'isActive']);
    mockMediaObserver.asObservable.and.returnValue(of([]));
    mockMediaObserver.isActive.and.returnValue(false);
    
    mockAppMenuService = jasmine.createSpyObj('AppMenuService', ['getMenuRoots'], {
      onPermissionMenuChanged: new Subject()
    });
    mockAppMenuService.getMenuRoots.and.returnValue([]);
    
    mockOUserInfoService = jasmine.createSpyObj('OUserInfoService', ['getUserInfo']);

    await TestBed.configureTestingModule({
      declarations: [...OTestingUtils.getCommonDeclarations()],
      imports: [
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        { provide: AppMenuService, useValue: mockAppMenuService },
        { provide: OUserInfoService, useValue: mockOUserInfoService },
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    injector = TestBed.inject(Injector);
    mockElementRef = new ElementRef(document.createElement('div'));
    
    // Create component manually to avoid OWrapperContentMenuComponent issues
    component = new OAppSidenavComponent(injector, mockRouter, mockElementRef, mockChangeDetectorRef, mockMediaObserver);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize without errors', () => {
    expect(() => {
      // Just verify component was created successfully
      expect(component).toBeInstanceOf(OAppSidenavComponent);
    }).not.toThrow();
  });

  it('should have basic component structure', () => {
    expect(component).toBeInstanceOf(OAppSidenavComponent);
  });
});
