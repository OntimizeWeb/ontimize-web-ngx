import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { OKeyboardListenerDirective } from './keyboard-listener.directive';

@Component({
  template: `<div oKeyboardListener [keyboardKeys]="keys" (onKeysPressed)="onPressed()"></div>`
})
class TestKeyboardComponent {
  keys = '65;66';
  pressCount = 0;
  onPressed() { this.pressCount++; }
}

describe('OKeyboardListenerDirective', () => {
  let fixture: ComponentFixture<TestKeyboardComponent>;
  let component: TestKeyboardComponent;
  let directive: OKeyboardListenerDirective;
  let el: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestKeyboardComponent],
      imports: [OKeyboardListenerDirective]
    });
    fixture = TestBed.createComponent(TestKeyboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.debugElement.query(By.directive(OKeyboardListenerDirective));
    directive = el.injector.get(OKeyboardListenerDirective);
  });

  // --- Creation ---

  describe('Creation', () => {
    it('should be created', () => {
      expect(directive).toBeTruthy();
    });
  });

  // --- parseKeyboardKeys ---

  describe('Method: parseKeyboardKeys()', () => {
    it('should parse semicolon-separated key codes into number array', () => {
      expect(directive['keyboardNumberKeysArray']).toEqual([65, 66]);
    });

    it('should handle a single key code', () => {
      component.keys = '13';
      directive['keyboardNumberKeysArray'] = [];
      directive['keyboardKeys'] = '13';
      directive.parseKeyboardKeys();
      expect(directive['keyboardNumberKeysArray']).toEqual([13]);
    });

    it('should produce an empty array for empty keys string', () => {
      directive['keyboardNumberKeysArray'] = [];
      directive['keyboardKeys'] = '';
      directive.parseKeyboardKeys();
      expect(directive['keyboardNumberKeysArray']).toEqual([]);
    });
  });

  // --- keyDown ---

  describe('HostListener: keyDown()', () => {
    it('should set activeKeys[keyCode] to true for a tracked key', () => {
      const mockEvent = { keyCode: 65, preventDefault: jasmine.createSpy(), stopPropagation: jasmine.createSpy() } as any;
      directive.keyDown(mockEvent);
      expect(directive['activeKeys'][65]).toBeTrue();
    });

    it('should not update activeKeys for an untracked key code', () => {
      const mockEvent = { keyCode: 99, preventDefault: jasmine.createSpy(), stopPropagation: jasmine.createSpy() } as any;
      directive.keyDown(mockEvent);
      expect(directive['activeKeys'][99]).toBeUndefined();
    });

    it('should call checkNeededKeys for a tracked key', () => {
      spyOn(directive, 'checkNeededKeys');
      const mockEvent = { keyCode: 65, preventDefault: jasmine.createSpy(), stopPropagation: jasmine.createSpy() } as any;
      directive.keyDown(mockEvent);
      expect(directive.checkNeededKeys).toHaveBeenCalledWith(mockEvent);
    });
  });

  // --- keyUp ---

  describe('HostListener: keyUp()', () => {
    it('should set activeKeys[keyCode] to false for a tracked key', () => {
      directive['activeKeys'][65] = true;
      const mockEvent = { keyCode: 65 } as any;
      directive.keyUp(mockEvent);
      expect(directive['activeKeys'][65]).toBeFalse();
    });

    it('should not change activeKeys for an untracked key', () => {
      const mockEvent = { keyCode: 99 } as any;
      directive.keyUp(mockEvent);
      expect(directive['activeKeys'][99]).toBeUndefined();
    });
  });

  // --- checkNeededKeys ---

  describe('Method: checkNeededKeys()', () => {
    let mockEvent: any;

    beforeEach(() => {
      mockEvent = { preventDefault: jasmine.createSpy(), stopPropagation: jasmine.createSpy() };
    });

    it('should emit onKeysPressed when all required keys are active', () => {
      const emitSpy = spyOn(directive.onKeysPressed, 'emit');
      directive['activeKeys'] = { 65: true, 66: true };
      directive.checkNeededKeys(mockEvent);
      expect(emitSpy).toHaveBeenCalled();
    });

    it('should call preventDefault and stopPropagation when emitting', () => {
      directive['activeKeys'] = { 65: true, 66: true };
      directive.checkNeededKeys(mockEvent);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });

    it('should not emit when only some keys are active', () => {
      const emitSpy = spyOn(directive.onKeysPressed, 'emit');
      directive['activeKeys'] = { 65: true, 66: false };
      directive.checkNeededKeys(mockEvent);
      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should not emit when no keys are active', () => {
      const emitSpy = spyOn(directive.onKeysPressed, 'emit');
      directive['activeKeys'] = {};
      directive.checkNeededKeys(mockEvent);
      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  // --- onKeysPressed output ---

  describe('Output: onKeysPressed', () => {
    it('should increment pressCount when all keys are held', () => {
      directive['activeKeys'] = { 65: true, 66: true };
      const mockEvent = { keyCode: 66, preventDefault: jasmine.createSpy(), stopPropagation: jasmine.createSpy() } as any;
      directive.keyDown(mockEvent);
      expect(component.pressCount).toBe(1);
    });
  });
});
