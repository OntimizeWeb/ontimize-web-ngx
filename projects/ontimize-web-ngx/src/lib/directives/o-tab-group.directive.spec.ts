import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { OTabGroupDirective, OTabMode } from './o-tab-group.directive';

@Component({
  template: `<div [oTabGroup]="mode"></div>`
})
class TestTabGroupComponent {
  mode: OTabMode = 'ontimize';
}

describe('OTabGroupDirective', () => {
  let fixture: ComponentFixture<TestTabGroupComponent>;
  let component: TestTabGroupComponent;
  let directive: OTabGroupDirective;
  let el: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OTabGroupDirective, TestTabGroupComponent]
    });
    fixture = TestBed.createComponent(TestTabGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.debugElement.query(By.directive(OTabGroupDirective));
    directive = el.injector.get(OTabGroupDirective);
  });

  // --- Creation ---

  describe('Creation', () => {
    it('should be created', () => {
      expect(directive).toBeTruthy();
    });
  });

  // --- Default mode (ontimize) ---

  describe('Default mode: ontimize', () => {
    it('should add o-tab-ontimize class on the host element', () => {
      expect(el.nativeElement.classList.contains('o-tab-ontimize')).toBeTrue();
    });

    it('should NOT have o-tab-material class in ontimize mode', () => {
      expect(el.nativeElement.classList.contains('o-tab-material')).toBeFalse();
    });

    it('should return "ontimize" from the mode getter', () => {
      expect(directive.mode).toBe('ontimize');
    });
  });

  // --- mode = 'material' ---

  describe('mode: material', () => {
    beforeEach(() => {
      component.mode = 'material';
      fixture.detectChanges();
    });

    it('should add o-tab-material class', () => {
      expect(el.nativeElement.classList.contains('o-tab-material')).toBeTrue();
    });

    it('should remove o-tab-ontimize class', () => {
      expect(el.nativeElement.classList.contains('o-tab-ontimize')).toBeFalse();
    });

    it('should return "material" from the mode getter', () => {
      expect(directive.mode).toBe('material');
    });
  });

  // --- Switching modes ---

  describe('Switching modes', () => {
    it('should switch from ontimize to material and back', () => {
      component.mode = 'material';
      fixture.detectChanges();
      expect(el.nativeElement.classList.contains('o-tab-material')).toBeTrue();

      component.mode = 'ontimize';
      fixture.detectChanges();
      expect(el.nativeElement.classList.contains('o-tab-ontimize')).toBeTrue();
      expect(el.nativeElement.classList.contains('o-tab-material')).toBeFalse();
    });

    it('should not accumulate both classes when switching mode', () => {
      component.mode = 'material';
      fixture.detectChanges();
      component.mode = 'ontimize';
      fixture.detectChanges();
      expect(el.nativeElement.classList.contains('o-tab-material')).toBeFalse();
      expect(el.nativeElement.classList.contains('o-tab-ontimize')).toBeTrue();
    });
  });
});
