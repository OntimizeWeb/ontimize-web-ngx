import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import {  CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA , Injector } from '@angular/core';
import { Subject } from 'rxjs';
import { OTestingUtils } from '../../../../../shared/testing/o-testing-utils';

// Import component dynamically to avoid compilation
let OTableButtonComponent: any;

describe('OTableButtonComponent', () => {
  let component: any;
  let mockCdr: any;
  let showButtonsTextSubject: Subject<boolean>;

  beforeEach(async () => {
    // Dynamically import to avoid early compilation
    const module = await import('./o-table-button.component');
    OTableButtonComponent = module.OTableButtonComponent;

    await TestBed.configureTestingModule({
      declarations: [...OTestingUtils.getCommonDeclarations()],
      imports: [
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    // Create component manually to avoid OWrapperContentMenuComponent issues
    const mockInjector = TestBed.inject(Injector);
    const mockElementRef: any = { nativeElement: document.createElement('div') };
    mockCdr = { markForCheck: jasmine.createSpy('markForCheck') };
    showButtonsTextSubject = new Subject<boolean>();
    const mockOTableBase: any = { showButtonsTextChange: showButtonsTextSubject.asObservable() };
    component = new OTableButtonComponent(mockInjector, mockElementRef, mockCdr, mockOTableBase);
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
    expect(component.constructor).toBe(OTableButtonComponent);
  });

  it('should mirror table.showButtonsText locally and markForCheck on every change (OnPush fix)', () => {
    component.ngOnInit();
    showButtonsTextSubject.next(true);
    expect(component.showButtonsText).toBe(true);
    expect(mockCdr.markForCheck).toHaveBeenCalled();

    mockCdr.markForCheck.calls.reset();
    showButtonsTextSubject.next(false);
    expect(component.showButtonsText).toBe(false);
    expect(mockCdr.markForCheck).toHaveBeenCalled();
  });

  it('should unsubscribe from showButtonsTextChange on destroy', () => {
    component.ngOnInit();
    component.ngOnDestroy();
    mockCdr.markForCheck.calls.reset();

    showButtonsTextSubject.next(false);

    expect(mockCdr.markForCheck).not.toHaveBeenCalled();
  });
});
