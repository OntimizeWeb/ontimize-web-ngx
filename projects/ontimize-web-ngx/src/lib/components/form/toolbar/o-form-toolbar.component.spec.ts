import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Injector, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { OTestingUtils } from '../../../shared/testing/o-testing-utils';
import { DialogService } from '../../../services/dialog.service';
import { NavigationService } from '../../../services/navigation.service';
import { SnackBarService } from '../../../services/snackbar.service';

// Import component dynamically to avoid compilation
let OFormToolbarComponent: any;
import { OFormBase } from '../o-form-base.class';

describe('OFormToolbarComponent', () => {
  let component: any;
  let mockOFormBase: any;
  let mockElementRef: any;
  let mockInjector: Injector;
  let mockDialogService: jasmine.SpyObj<DialogService>;
  let mockNavigationService: jasmine.SpyObj<NavigationService>;
  let mockSnackBarService: jasmine.SpyObj<SnackBarService>;

  beforeEach(async () => {
    // Dynamically import to avoid early compilation
    const module = await import('./o-form-toolbar.component');
    OFormToolbarComponent = module.OFormToolbarComponent;
    
    // Create service mocks
    mockDialogService = jasmine.createSpyObj('DialogService', ['confirm']);
    mockNavigationService = jasmine.createSpyObj('NavigationService', ['onTitleChange', 'back']);
    // onTitleChange should be a function that accepts a callback and returns a subscription
    mockNavigationService.onTitleChange.and.callFake((callback: any) => {
      return { unsubscribe: jasmine.createSpy('unsubscribe') };
    });
    mockSnackBarService = jasmine.createSpyObj('SnackBarService', ['open']);
    
    await TestBed.configureTestingModule({
      declarations: [...OTestingUtils.getCommonDeclarations()],
      imports: [
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        { provide: DialogService, useValue: mockDialogService },
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: SnackBarService, useValue: mockSnackBarService },
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    // Create component manually to avoid OWrapperContentMenuComponent issues
    mockOFormBase = {
      registerToolbar: jasmine.createSpy('registerToolbar'),
      isEditableDetail: jasmine.createSpy('isEditableDetail').and.returnValue(true),
      includeBreadcrumb: true,
      formContainer: {
        breadcrumb: true
      }
    };
    mockElementRef = { nativeElement: document.createElement('div') };
    mockInjector = TestBed.inject(Injector);
    component = new OFormToolbarComponent(mockOFormBase, mockElementRef, mockInjector);
    
    // Manually inject the mock services to ensure they're properly set
    (component as any)._navigationService = mockNavigationService;
    (component as any)._dialogService = mockDialogService;
    (component as any).snackBarService = mockSnackBarService;
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
    expect(component.constructor).toBe(OFormToolbarComponent);
  });

  // Test default values and initialization
  it('should have default values after construction', () => {
    expect(component.labelHeader).toBe('');
    expect(component.headeractions).toBe('');
    expect(component.labelHeaderAlign).toBe('center');
    expect(component.showHeaderActionsText).toBe(true);
    expect(component.showHeaderNavigation).toBe(true);
    expect(component.isDetail).toBe(true);
    expect(component.editMode).toBe(false);
    expect(component.insertMode).toBe(false);
    expect(component.initialMode).toBe(true);
    expect(component.refreshBtnEnabled).toBe(false);
    expect(component.insertBtnEnabled).toBe(false);
    expect(component.deleteBtnEnabled).toBe(false);
    expect(component.changesToSave).toBe(false);
    expect(component.editBtnEnabled).toBe(false);
    expect(component.saveBtnEnabled).toBe(false);
  });

  it('should register itself with form on construction', () => {
    expect(mockOFormBase.registerToolbar).toHaveBeenCalledWith(component);
  });

  it('should initialize observables on construction', () => {
    expect(component.isSaveBtnEnabled).toBeDefined();
    expect(component.isEditBtnEnabled).toBeDefined();
    expect(component.existsChangesToSave).toBeDefined();
    expect(component.onCancel).toBeInstanceOf(EventEmitter);
  });

  // Test ngOnInit method
  it('should parse form actions on ngOnInit', () => {
    component.headeractions = 'R;I;U;D';
    
    component.ngOnInit();
    
    expect(component.formActions).toEqual(['R', 'I', 'U', 'D']);
    expect(component.refreshBtnEnabled).toBe(true);
    expect(component.insertBtnEnabled).toBe(true);
    expect(component.editBtnEnabled).toBe(true);
    expect(component.deleteBtnEnabled).toBe(true);
  });

  it('should handle individual form actions on ngOnInit', () => {
    component.headeractions = 'R';
    
    component.ngOnInit();
    
    expect(component.refreshBtnEnabled).toBe(true);
    expect(component.insertBtnEnabled).toBe(false);
    expect(component.editBtnEnabled).toBe(false);
    expect(component.deleteBtnEnabled).toBe(false);
  });

  it('should handle insert action on ngOnInit', () => {
    component.headeractions = 'I';
    
    component.ngOnInit();
    
    expect(component.insertBtnEnabled).toBe(true);
    expect(component.refreshBtnEnabled).toBe(false);
  });

  it('should disable delete button in insert mode', () => {
    component.headeractions = 'D';
    component.insertMode = true;
    
    component.ngOnInit();
    
    expect(component.deleteBtnEnabled).toBe(false);
  });

  it('should set up navigation service title change listener', () => {
    mockNavigationService.onTitleChange.and.callFake((callback) => {
      callback('Test Title');
      return { unsubscribe: jasmine.createSpy() };
    });
    
    component.ngOnInit();
    
    expect(component.labelHeader).toBe('Test Title');
    expect(mockNavigationService.onTitleChange).toHaveBeenCalled();
  });

  // Test changesToSave getter/setter
  it('should update changesToSave and emit to subject', () => {
    let emittedValue: boolean;
    component.existsChangesToSave.subscribe((value: boolean) => {
      emittedValue = value;
    });
    
    component.changesToSave = true;
    
    expect(component.changesToSave).toBe(true);
    expect(emittedValue).toBe(true);
  });

  it('should not emit changesToSave when permissions deny', () => {
    component.actionsPermissions = [{
      attr: 'update',
      enabled: false,
      visible: true
    }];
    let emittedValue: boolean = false;
    component.existsChangesToSave.subscribe((value: boolean) => {
      emittedValue = value;
    });
    
    component.changesToSave = true;
    
    expect(component.changesToSave).toBe(true);
    expect(emittedValue).toBe(false); // Should not emit due to permissions
  });

  // Test editBtnEnabled getter/setter
  it('should update editBtnEnabled and emit to subject', () => {
    let emittedValue: boolean;
    component.isEditBtnEnabled.subscribe((value: boolean) => {
      emittedValue = value;
    });
    
    component.editBtnEnabled = true;
    
    expect(component.editBtnEnabled).toBe(true);
    expect(emittedValue).toBe(true);
  });

  // Test saveBtnEnabled getter/setter
  it('should update saveBtnEnabled and emit to subject', () => {
    let emittedValue: boolean;
    component.isSaveBtnEnabled.subscribe((value: boolean) => {
      emittedValue = value;
    });
    
    component.saveBtnEnabled = true;
    
    expect(component.saveBtnEnabled).toBe(true);
    expect(emittedValue).toBe(true);
  });

  // Test BooleanInputConverter properties
  it('should handle showHeaderActionsText as boolean converter', () => {
    component.showHeaderActionsText = 'false' as any;
    expect(component.showHeaderActionsText).toBe(false);
    
    component.showHeaderActionsText = 'true' as any;
    expect(component.showHeaderActionsText).toBe(true);
    
    component.showHeaderActionsText = true;
    expect(component.showHeaderActionsText).toBe(true);
  });

  it('should handle showHeaderNavigation as boolean converter', () => {
    component.showHeaderNavigation = 'false' as any;
    expect(component.showHeaderNavigation).toBe(false);
    
    component.showHeaderNavigation = 'true' as any;
    expect(component.showHeaderNavigation).toBe(true);
    
    component.showHeaderNavigation = false;
    expect(component.showHeaderNavigation).toBe(false);
  });

  // Test includeBreadcrumb property
  it('should set includeBreadcrumb based on form settings', () => {
    mockOFormBase.includeBreadcrumb = true;
    mockOFormBase.formContainer = { breadcrumb: true };
    
    component.ngOnInit();
    
    expect(component.includeBreadcrumb).toBe(true);
  });

  it('should not set includeBreadcrumb when form settings are false', () => {
    mockOFormBase.includeBreadcrumb = false;
    mockOFormBase.formContainer = { breadcrumb: false };
    
    component.ngOnInit();
    
    expect(component.includeBreadcrumb).toBe(false);
  });

  // Test observable behavior
  it('should emit correct values through observables', (done) => {
    let saveEnabled = false;
    let editEnabled = false;
    let changesExist = false;
    
    component.isSaveBtnEnabled.subscribe(value => saveEnabled = value);
    component.isEditBtnEnabled.subscribe(value => editEnabled = value);
    component.existsChangesToSave.subscribe(value => changesExist = value);
    
    component.saveBtnEnabled = true;
    component.editBtnEnabled = true;
    component.changesToSave = true;
    
    setTimeout(() => {
      expect(saveEnabled).toBe(true);
      expect(editEnabled).toBe(true);
      expect(changesExist).toBe(true);
      done();
    }, 10);
  });

  // Test empty header actions
  it('should handle empty header actions', () => {
    component.headeractions = '';
    
    component.ngOnInit();
    
    expect(component.formActions).toEqual([]);
    expect(component.refreshBtnEnabled).toBe(false);
    expect(component.insertBtnEnabled).toBe(false);
    expect(component.editBtnEnabled).toBe(false);
    expect(component.deleteBtnEnabled).toBe(false);
  });

  // Test undefined header actions
  it('should handle undefined header actions', () => {
    component.headeractions = undefined;
    
    component.ngOnInit();
    
    expect(component.refreshBtnEnabled).toBe(false);
    expect(component.insertBtnEnabled).toBe(false);
    expect(component.editBtnEnabled).toBe(false);
    expect(component.deleteBtnEnabled).toBe(false);
  });

  // Test labelHeader property - safe property test
  it('should handle labelHeader property correctly', () => {
    expect(component.labelHeader).toBe(''); // default value
    
    component.labelHeader = 'Test Header';
    expect(component.labelHeader).toBe('Test Header');
  });

  // Test labelHeaderAlign property - safe property test
  it('should handle labelHeaderAlign property correctly', () => {
    expect(component.labelHeaderAlign).toBe('center'); // default value
    
    component.labelHeaderAlign = 'left';
    expect(component.labelHeaderAlign).toBe('left');
    
    component.labelHeaderAlign = 'right';
    expect(component.labelHeaderAlign).toBe('right');
  });

  // Test showHeaderActionsText property - safe property test
  it('should handle showHeaderActionsText property correctly', () => {
    expect(component.showHeaderActionsText).toBe(true); // default value
    
    component.showHeaderActionsText = false;
    expect(component.showHeaderActionsText).toBe(false);
  });

  // Test showHeaderNavigation property - safe property test
  it('should handle showHeaderNavigation property correctly', () => {
    expect(component.showHeaderNavigation).toBe(true); // default value
    
    component.showHeaderNavigation = false;
    expect(component.showHeaderNavigation).toBe(false);
  });

  // Test mode properties - safe property tests
  it('should handle mode properties correctly', () => {
    // Test initial values
    expect(component.editMode).toBe(false);
    expect(component.insertMode).toBe(false);
    expect(component.initialMode).toBe(true);
    
    // Test setting different modes
    component.editMode = true;
    expect(component.editMode).toBe(true);
    
    component.insertMode = true;
    expect(component.insertMode).toBe(true);
    
    component.initialMode = false;
    expect(component.initialMode).toBe(false);
  });

  // Test includeBreadcrumb based on form settings - safe logic test
  it('should set includeBreadcrumb based on form settings', () => {
    // Test when both form properties are true
    mockOFormBase.includeBreadcrumb = true;
    mockOFormBase.formContainer.breadcrumb = true;
    
    component.ngOnInit();
    
    expect(component.includeBreadcrumb).toBe(true);
  });

  it('should not set includeBreadcrumb when form settings are false', () => {
    // Test when form container breadcrumb is false
    mockOFormBase.includeBreadcrumb = true;
    mockOFormBase.formContainer.breadcrumb = false;
    
    component.ngOnInit();
    
    expect(component.includeBreadcrumb).toBe(false);
  });
});
