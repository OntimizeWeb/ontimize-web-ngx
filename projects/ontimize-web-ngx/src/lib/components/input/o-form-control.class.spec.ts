import { UntypedFormControl, Validators } from '@angular/forms';
import { OFormControl } from './o-form-control.class';

describe('OFormControl', () => {
  let control: OFormControl;

  beforeEach(() => {
    control = new OFormControl(null);
  });

  // ─── Creation ────────────────────────────────────────────────────────────────

  describe('Creation', () => {
    it('should create an instance', () => {
      expect(control).toBeTruthy();
    });

    it('should be an instance of OFormControl', () => {
      expect(control instanceof OFormControl).toBe(true);
    });

    it('should extend UntypedFormControl', () => {
      expect(control instanceof UntypedFormControl).toBe(true);
    });

    it('should accept an initial value', () => {
      const c = new OFormControl('hello');
      expect(c.value).toBe('hello');
    });

    it('should accept sync validators', () => {
      const c = new OFormControl('', Validators.required);
      expect(c.errors?.['required']).toBe(true);
    });

    it('should accept an array of sync validators', () => {
      const c = new OFormControl('', [Validators.required, Validators.minLength(5)]);
      expect(c.errors?.['required']).toBe(true);
    });

    it('should have fControlChildren undefined by default', () => {
      expect(control.fControlChildren).toBeUndefined();
    });
  });

  // ─── getValue() ──────────────────────────────────────────────────────────────

  describe('Method: getValue()', () => {
    it('should return null when value is null', () => {
      expect(control.getValue()).toBeNull();
    });

    it('should return the current value', () => {
      control.setValue('test');
      expect(control.getValue()).toBe('test');
    });

    it('should return updated value after setValue', () => {
      control.setValue(42);
      expect(control.getValue()).toBe(42);
    });

    it('should return undefined when value is undefined', () => {
      control.setValue(undefined);
      expect(control.getValue()).toBeUndefined();
    });
  });

  // ─── markAsTouched() ─────────────────────────────────────────────────────────

  describe('Method: markAsTouched()', () => {
    it('should mark the control itself as touched', () => {
      expect(control.touched).toBe(false);
      control.markAsTouched();
      expect(control.touched).toBe(true);
    });

    it('should not throw when fControlChildren is undefined', () => {
      expect(() => control.markAsTouched()).not.toThrow();
    });

    it('should not throw when fControlChildren is null', () => {
      (control as any).fControlChildren = null;
      expect(() => control.markAsTouched()).not.toThrow();
    });

    it('should propagate markAsTouched to UntypedFormControl children', () => {
      const child = new UntypedFormControl('');
      control.fControlChildren = [child];
      control.markAsTouched();
      expect(child.touched).toBe(true);
    });

    it('should propagate markAsTouched to OFormDataComponent children via getFormControl()', () => {
      const innerControl = new UntypedFormControl('');
      const mockChild = {
        getFormControl: jasmine.createSpy('getFormControl').and.returnValue(innerControl)
      } as any;
      control.fControlChildren = [mockChild];
      spyOn(innerControl, 'markAsTouched');
      control.markAsTouched();
      expect(innerControl.markAsTouched).toHaveBeenCalled();
    });

    it('should skip OFormDataComponent child when getFormControl() returns null', () => {
      const mockChild = {
        getFormControl: jasmine.createSpy('getFormControl').and.returnValue(null)
      } as any;
      control.fControlChildren = [mockChild];
      expect(() => control.markAsTouched()).not.toThrow();
    });

    it('should propagate opts to UntypedFormControl children', () => {
      const child = new UntypedFormControl('');
      spyOn(child, 'markAsTouched').and.callThrough();
      control.fControlChildren = [child];
      control.markAsTouched({ onlySelf: true });
      expect(child.markAsTouched).toHaveBeenCalledWith({ onlySelf: true });
    });

    it('should handle mixed children (UntypedFormControl and OFormDataComponent)', () => {
      const formChild = new UntypedFormControl('');
      const innerControl = new UntypedFormControl('');
      const componentChild = {
        getFormControl: jasmine.createSpy('getFormControl').and.returnValue(innerControl)
      } as any;
      control.fControlChildren = [formChild, componentChild];
      spyOn(formChild, 'markAsTouched').and.callThrough();
      spyOn(innerControl, 'markAsTouched');
      control.markAsTouched();
      expect(formChild.markAsTouched).toHaveBeenCalled();
      expect(innerControl.markAsTouched).toHaveBeenCalled();
    });
  });

  // ─── markAsDirty() ───────────────────────────────────────────────────────────

  describe('Method: markAsDirty()', () => {
    it('should mark the control itself as dirty', () => {
      expect(control.dirty).toBe(false);
      control.markAsDirty();
      expect(control.dirty).toBe(true);
    });

    it('should not throw when fControlChildren is undefined', () => {
      expect(() => control.markAsDirty()).not.toThrow();
    });

    it('should not throw when fControlChildren is null', () => {
      (control as any).fControlChildren = null;
      expect(() => control.markAsDirty()).not.toThrow();
    });

    it('should propagate markAsDirty to UntypedFormControl children', () => {
      const child = new UntypedFormControl('');
      control.fControlChildren = [child];
      control.markAsDirty();
      expect(child.dirty).toBe(true);
    });

    it('should propagate markAsDirty to OFormDataComponent children via getFormControl()', () => {
      const innerControl = new UntypedFormControl('');
      const mockChild = {
        getFormControl: jasmine.createSpy('getFormControl').and.returnValue(innerControl)
      } as any;
      control.fControlChildren = [mockChild];
      spyOn(innerControl, 'markAsDirty');
      control.markAsDirty();
      expect(innerControl.markAsDirty).toHaveBeenCalled();
    });

    it('should skip OFormDataComponent child when getFormControl() returns null', () => {
      const mockChild = {
        getFormControl: jasmine.createSpy('getFormControl').and.returnValue(null)
      } as any;
      control.fControlChildren = [mockChild];
      expect(() => control.markAsDirty()).not.toThrow();
    });

    it('should propagate opts to UntypedFormControl children', () => {
      const child = new UntypedFormControl('');
      spyOn(child, 'markAsDirty').and.callThrough();
      control.fControlChildren = [child];
      control.markAsDirty({ onlySelf: true });
      expect(child.markAsDirty).toHaveBeenCalledWith({ onlySelf: true });
    });
  });

  // ─── markAsPristine() ────────────────────────────────────────────────────────

  describe('Method: markAsPristine()', () => {
    it('should mark the control itself as pristine', () => {
      control.markAsDirty();
      expect(control.pristine).toBe(false);
      control.markAsPristine();
      expect(control.pristine).toBe(true);
    });

    it('should not throw when fControlChildren is undefined', () => {
      expect(() => control.markAsPristine()).not.toThrow();
    });

    it('should not throw when fControlChildren is null', () => {
      (control as any).fControlChildren = null;
      expect(() => control.markAsPristine()).not.toThrow();
    });

    it('should propagate markAsPristine to UntypedFormControl children', () => {
      const child = new UntypedFormControl('');
      child.markAsDirty();
      control.fControlChildren = [child];
      control.markAsPristine();
      expect(child.pristine).toBe(true);
    });

    it('should propagate markAsPristine to OFormDataComponent children via getFormControl()', () => {
      const innerControl = new UntypedFormControl('');
      const mockChild = {
        getFormControl: jasmine.createSpy('getFormControl').and.returnValue(innerControl)
      } as any;
      control.fControlChildren = [mockChild];
      spyOn(innerControl, 'markAsPristine');
      control.markAsPristine();
      expect(innerControl.markAsPristine).toHaveBeenCalled();
    });

    it('should skip OFormDataComponent child when getFormControl() returns null', () => {
      const mockChild = {
        getFormControl: jasmine.createSpy('getFormControl').and.returnValue(null)
      } as any;
      control.fControlChildren = [mockChild];
      expect(() => control.markAsPristine()).not.toThrow();
    });

    it('should propagate opts to UntypedFormControl children', () => {
      const child = new UntypedFormControl('');
      spyOn(child, 'markAsPristine').and.callThrough();
      control.fControlChildren = [child];
      control.markAsPristine({ onlySelf: true });
      expect(child.markAsPristine).toHaveBeenCalledWith({ onlySelf: true });
    });
  });

  // ─── fControlChildren interaction ────────────────────────────────────────────

  describe('fControlChildren', () => {
    it('should allow setting an array of UntypedFormControl children', () => {
      control.fControlChildren = [new UntypedFormControl('a'), new UntypedFormControl('b')];
      expect(control.fControlChildren.length).toBe(2);
    });

    it('should handle empty fControlChildren array without error', () => {
      control.fControlChildren = [];
      expect(() => {
        control.markAsTouched();
        control.markAsDirty();
        control.markAsPristine();
      }).not.toThrow();
    });

    it('should propagate all three mark methods to multiple children', () => {
      const child1 = new UntypedFormControl('');
      const child2 = new UntypedFormControl('');
      control.fControlChildren = [child1, child2];

      control.markAsTouched();
      expect(child1.touched).toBe(true);
      expect(child2.touched).toBe(true);

      control.markAsDirty();
      expect(child1.dirty).toBe(true);
      expect(child2.dirty).toBe(true);

      control.markAsPristine();
      expect(child1.pristine).toBe(true);
      expect(child2.pristine).toBe(true);
    });
  });
});
