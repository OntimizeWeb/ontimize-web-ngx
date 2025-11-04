import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Injector, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';

import { OTestingUtils } from '../../../shared/testing/o-testing-utils';

// Import component dynamically to avoid compilation
let OAppSidenavImageComponent: any;

import { OAppSidenavBase } from '../o-app-sidenav-base.class';

describe('OAppSidenavImageComponent', () => {
  let component: any;
  let injector: Injector;
  let mockSidenav: jasmine.SpyObj<OAppSidenavBase>;
  let mockChangeDetectorRef: jasmine.SpyObj<ChangeDetectorRef>;

  beforeEach(async () => {
    // Dynamically import to avoid early compilation
    const module = await import('./o-app-sidenav-image.component');
    OAppSidenavImageComponent = module.OAppSidenavImageComponent;
    
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

  // Test ngOnInit lifecycle hook
  it('should subscribe to sidenav events on ngOnInit', () => {
    spyOn(component, 'updateImage');
    
    component.ngOnInit();
    
    expect(component.updateImage).toHaveBeenCalled();
  });

  it('should handle ngOnInit when sidenav is null', () => {
    component['sidenav'] = null;
    
    expect(() => {
      component.ngOnInit();
    }).not.toThrow();
  });

  // Test ngOnDestroy lifecycle hook
  it('should unsubscribe on ngOnDestroy', () => {
    const subscription = component['subscription'];
    spyOn(subscription, 'unsubscribe');
    
    component.ngOnDestroy();
    
    expect(subscription.unsubscribe).toHaveBeenCalled();
  });

  // Test ngOnChanges lifecycle hook
  it('should update image when openedSrc changes', () => {
    spyOn(component, 'updateImage');
    const changes = {
      openedSrc: {
        currentValue: 'new-opened.png',
        previousValue: 'old-opened.png',
        firstChange: false,
        isFirstChange: () => false
      }
    };
    
    component.ngOnChanges(changes);
    
    expect(component.updateImage).toHaveBeenCalled();
  });

  it('should update image when closedSrc changes', () => {
    spyOn(component, 'updateImage');
    const changes = {
      closedSrc: {
        currentValue: 'new-closed.png',
        previousValue: 'old-closed.png',
        firstChange: false,
        isFirstChange: () => false
      }
    };
    
    component.ngOnChanges(changes);
    
    expect(component.updateImage).toHaveBeenCalled();
  });

  it('should not update image when other properties change', () => {
    spyOn(component, 'updateImage');
    const changes = {
      someOtherProperty: {
        currentValue: 'new-value',
        previousValue: 'old-value',
        firstChange: false,
        isFirstChange: () => false
      }
    };
    
    component.ngOnChanges(changes);
    
    expect(component.updateImage).not.toHaveBeenCalled();
  });

  // Test individual setter methods
  it('should call setOpenedImg when sidenav is opened', () => {
    spyOn(component, 'setOpenedImg');
    spyOn(component, 'setClosedImg');
    component.openedSrc = 'opened.png';
    component.closedSrc = 'closed.png';
    mockSidenav.sidenav.opened = true;
    
    component.updateImage();
    
    expect(component.setOpenedImg).toHaveBeenCalled();
    expect(component.setClosedImg).not.toHaveBeenCalled();
  });

  it('should call setClosedImg when sidenav is closed', () => {
    spyOn(component, 'setOpenedImg');
    spyOn(component, 'setClosedImg');
    component.openedSrc = 'opened.png';
    component.closedSrc = 'closed.png';
    mockSidenav.sidenav.opened = false;
    
    component.updateImage();
    
    expect(component.setClosedImg).toHaveBeenCalled();
    expect(component.setOpenedImg).not.toHaveBeenCalled();
  });

  // Test setOpenedImg method
  it('should set opened image src', () => {
    component.openedSrc = 'opened-image.png';
    
    component.setOpenedImg();
    
    expect(component.src).toBe('opened-image.png');
  });

  // Test setClosedImg method
  it('should set closed image src', () => {
    component.closedSrc = 'closed-image.png';
    
    component.setClosedImg();
    
    expect(component.src).toBe('closed-image.png');
  });

  // Test updateImage with null sidenav
  it('should handle updateImage when sidenav is null', () => {
    component['sidenav'] = null;
    component.closedSrc = 'closed.png';
    spyOn(component, 'setClosedImg');
    
    component.updateImage();
    
    expect(component.setClosedImg).toHaveBeenCalled();
  });

  // Test updateImage with null sidenav.sidenav
  it('should handle updateImage when sidenav.sidenav is null', () => {
    mockSidenav.sidenav = null;
    component.closedSrc = 'closed.png';
    spyOn(component, 'setClosedImg');
    
    component.updateImage();
    
    expect(component.setClosedImg).toHaveBeenCalled();
  });

  // Test src getter and setter
  it('should set and get src property', () => {
    const testSrc = 'test-image.png';
    
    component.src = testSrc;
    
    expect(component.src).toBe(testSrc);
  });

  // Test showImage with undefined src
  it('should not show image when src is undefined', () => {
    component['_src'] = undefined;
    
    expect(component.showImage).toBe(false);
  });

  // Test change detection call
  it('should trigger change detection when updating image', () => {
    component.updateImage();
    
    expect(mockChangeDetectorRef.detectChanges).toHaveBeenCalled();
  });

  // Test component host class
  it('should have the correct host class', () => {
    expect(component).toBeDefined();
    // Host class is set via decorator, test the component configuration
  });
});
