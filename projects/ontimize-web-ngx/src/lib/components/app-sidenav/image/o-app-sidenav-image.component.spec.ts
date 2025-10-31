import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Injector, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';

import { OAppSidenavImageComponent } from './o-app-sidenav-image.component';
import { OTestingUtils } from '../../../shared/testing/o-testing-utils';
import { OAppSidenavBase } from '../o-app-sidenav-base.class';

describe('OAppSidenavImageComponent', () => {
  let component: OAppSidenavImageComponent;
  let injector: Injector;
  let mockSidenav: jasmine.SpyObj<OAppSidenavBase>;
  let mockChangeDetectorRef: jasmine.SpyObj<ChangeDetectorRef>;

  beforeEach(async () => {
    // Create mock for OAppSidenavBase
    mockSidenav = jasmine.createSpyObj('OAppSidenavBase', [], {
      onSidenavClosedStart: new Subject(),
      onSidenavOpenedStart: new Subject(),
      sidenav: {
        opened: false
      }
    });
    
    mockChangeDetectorRef = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges', 'markForCheck']);

    await TestBed.configureTestingModule({
      declarations: [...OTestingUtils.getCommonDeclarations()],
      imports: [
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        { provide: OAppSidenavBase, useValue: mockSidenav },
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    injector = TestBed.inject(Injector);
    
    // Create component manually to avoid OWrapperContentMenuComponent issues
    component = new OAppSidenavImageComponent(injector, mockChangeDetectorRef);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize without errors', () => {
    expect(() => {
      expect(component).toBeInstanceOf(OAppSidenavImageComponent);
    }).not.toThrow();
  });

  it('should have basic component structure', () => {
    expect(component).toBeInstanceOf(OAppSidenavImageComponent);
  });

  it('should set closed image when sidenav is closed', () => {
    component.openedSrc = 'opened.png';
    component.closedSrc = 'closed.png';
    mockSidenav.sidenav.opened = false;
    
    component.updateImage();
    
    expect(component.src).toBe('closed.png');
  });

  it('should set opened image when sidenav is opened', () => {
    component.openedSrc = 'opened.png';
    component.closedSrc = 'closed.png';
    mockSidenav.sidenav.opened = true;
    
    component.updateImage();
    
    expect(component.src).toBe('opened.png');
  });

  it('should show image when src is set', () => {
    component.src = 'test.png';
    expect(component.showImage).toBe(true);
  });

  it('should not show image when src is empty', () => {
    component.src = '';
    expect(component.showImage).toBe(false);
  });
});
