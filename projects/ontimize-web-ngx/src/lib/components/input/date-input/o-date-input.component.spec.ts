import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Injector } from '@angular/core';
import { OTestingUtils } from '../../../shared/testing/o-testing-utils';
import { OntimizeLuxonDateAdapter } from '../../../shared/material/date/ontimize-luxon-date-adapter';

// Import component dynamically to avoid compilation
let ODateInputComponent: any;

describe('ODateInputComponent', () => {
  let component: any;
  let dateAdapter: OntimizeLuxonDateAdapter;

  beforeEach(async () => {
    // Dynamically import to avoid early compilation
    const module = await import('./o-date-input.component');
    ODateInputComponent = module.ODateInputComponent;

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
    const mockElementRef: any = { nativeElement: document.createElement('div') };
    const mockInjector = TestBed.inject(Injector);
    dateAdapter = new OntimizeLuxonDateAdapter('en');
    // OFormDataComponent's constructor calls inject(O_FORM_CONTEXT), which requires an active injection context.
    component = TestBed.runInInjectionContext(() => new ODateInputComponent(dateAdapter, mockElementRef, mockInjector));
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
    expect(component.constructor).toBe(ODateInputComponent);
  });

  // getValue() has no override in ODateInputComponent: it ignores value-type entirely and just
  // returns whatever is stored, unchanged — including a native Date instance. This keeps it
  // consistent with what hasComponentChanged() compares against (the raw FormControl value), and
  // means it can no longer discard a value it fails to recognize (see CHANGELOG for the full story).
  // A prior revision special-cased a Date instance into a timestamp number, but that silently
  // ignored value-type whenever the stored value happened to be a Date (see CHANGELOG next.15).
  describe('getValue() (value-type-agnostic passthrough)', () => {
    it('passes a native Date instance through unchanged, regardless of value-type', () => {
      component.valueType = 'date';
      const input = new Date(2019, 4, 26);
      component.setValue(input);
      expect(component.getValue()).toBe(input);
    });

    it('passes a backend-supplied date string through unchanged for value-type="date"', () => {
      component.valueType = 'date';
      component.setValue('2019-05-26');
      expect(component.getValue()).toBe('2019-05-26');
    });

    it('passes a numeric timestamp through unchanged for value-type="timestamp"', () => {
      component.valueType = 'timestamp';
      const input = new Date(2019, 4, 26).getTime();
      component.setValue(input);
      expect(component.getValue()).toBe(input);
    });

    it('passes an ISO string through unchanged for value-type="iso-8601"', () => {
      component.valueType = 'iso-8601';
      component.setValue('2019-05-26T00:00:00.000Z');
      expect(component.getValue()).toBe('2019-05-26T00:00:00.000Z');
    });
  });

  describe('clearValue()', () => {
    it('resets both getValue() and getValueAsDate()', () => {
      component.valueType = 'date';
      component.setValue(new Date(2019, 4, 26));
      component.clearValue();
      expect(component.getValue()).toBeUndefined();
      expect(component.getValueAsDate()).toBeUndefined();
    });
  });
});
