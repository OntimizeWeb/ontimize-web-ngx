import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { InputRegulateDirective } from './input-regulate.directive';

@Component({
  template: `
    <div>Without Directive</div>
    <input oInputRegulate [oInputRegulatePattern]="pattern" />
  `
})
class TestComponent {
  pattern: string;
}

describe('InputRegulateDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let directive: InputRegulateDirective;
  let inputEl: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [InputRegulateDirective]
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  const setup = () => {
    fixture.detectChanges();
    inputEl = fixture.debugElement.query(By.directive(InputRegulateDirective));
    directive = inputEl.injector.get(InputRegulateDirective);
  };

  // --- Creation ---

  describe('Creation', () => {
    beforeEach(setup);

    it('should have bare element', () => {
      const bareElement = fixture.debugElement.query(By.css(':not([oInputRegulate])'));
      expect(bareElement).toBeTruthy();
    });

    it('should have 1 element with directive', () => {
      const elems = fixture.debugElement.queryAll(By.directive(InputRegulateDirective));
      expect(elems.length).toBe(1);
    });

    it('should create the directive instance', () => {
      expect(directive).toBeTruthy();
    });
  });

  // --- ngOnInit ---

  describe('Method: ngOnInit()', () => {
    it('should build regExpattern when oInputRegulatePattern is defined', () => {
      component.pattern = '^[0-9]*$';
      setup();
      expect(directive.regExpattern).toBeInstanceOf(RegExp);
      expect(directive.regExpattern.source).toBe('^[0-9]*$');
    });

    it('should leave regExpattern undefined when pattern is not set', () => {
      setup();
      expect(directive.regExpattern).toBeUndefined();
    });
  });

  // --- ControlValueAccessor ---

  describe('ControlValueAccessor', () => {
    beforeEach(setup);

    it('registerOnChange should store the callback', () => {
      const fn = jasmine.createSpy('onChange');
      directive.registerOnChange(fn);
      expect((directive as any).onChange).toBe(fn);
    });

    it('registerOnTouched should store the callback', () => {
      const fn = jasmine.createSpy('onTouched');
      directive.registerOnTouched(fn);
      expect((directive as any).onTouched).toBe(fn);
    });

    it('setDisabledState(true) should disable the native element', () => {
      directive.setDisabledState(true);
      expect(inputEl.nativeElement.disabled).toBeTrue();
    });

    it('setDisabledState(false) should enable the native element', () => {
      directive.setDisabledState(true);
      directive.setDisabledState(false);
      expect(inputEl.nativeElement.disabled).toBeFalse();
    });

    it('writeValue should set the element value', () => {
      directive.writeValue('hello');
      expect(inputEl.nativeElement.value).toBe('hello');
    });

    it('writeValue with null should set empty string', () => {
      directive.writeValue(null);
      expect(inputEl.nativeElement.value).toBe('');
    });

    it('writeValue should not call onChange (propagateChange = false)', () => {
      const fn = jasmine.createSpy('onChange');
      directive.registerOnChange(fn);
      directive.writeValue('hello');
      expect(fn).not.toHaveBeenCalled();
    });
  });

  // --- onInputChange ---

  describe('HostListener: onInputChange()', () => {
    describe('with pattern set', () => {
      let onChange: jasmine.Spy;

      beforeEach(() => {
        component.pattern = '^[0-9]*$';
        setup();
        onChange = jasmine.createSpy('onChange');
        directive.registerOnChange(onChange);
        directive['value'] = '1';
      });

      it('should accept a matching value and propagate the change', () => {
        directive.onInputChange('123');
        expect(inputEl.nativeElement.value).toBe('123');
        expect(onChange).toHaveBeenCalledWith('123');
      });

      it('should revert to previous value when input does not match the pattern', () => {
        directive.onInputChange('abc');
        expect(inputEl.nativeElement.value).toBe('1');
        expect(onChange).not.toHaveBeenCalled();
      });

      it('should accept empty string if it matches the pattern', () => {
        directive.onInputChange('');
        expect(inputEl.nativeElement.value).toBe('');
      });
    });

    describe('without pattern', () => {
      it('should not call onChange when regExpattern is not defined', () => {
        setup();
        const fn = jasmine.createSpy('onChange');
        directive.registerOnChange(fn);
        directive['value'] = 'old';
        directive.onInputChange('new');
        expect(fn).not.toHaveBeenCalled();
      });
    });
  });

  // --- onBlur ---

  describe('HostListener: onBlur()', () => {
    beforeEach(setup);

    it('should invoke the onTouched callback', () => {
      const fn = jasmine.createSpy('onTouched');
      directive.registerOnTouched(fn);
      directive.onBlur();
      expect(fn).toHaveBeenCalled();
    });
  });
});
