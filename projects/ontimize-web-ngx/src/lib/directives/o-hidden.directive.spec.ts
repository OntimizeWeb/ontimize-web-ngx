import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { OHiddenDirective } from './o-hidden.directive';

@Component({
  template: `<div oHidden id="target">Content</div>`
})
class TestHiddenComponent {}

@Component({
  template: `<span oHidden id="span-target">text</span>`
})
class TestHiddenSpanComponent {}

describe('OHiddenDirective', () => {

  describe('on a div element', () => {
    let fixture: ComponentFixture<TestHiddenComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [OHiddenDirective],
        declarations: [TestHiddenComponent]
      });
      fixture = TestBed.createComponent(TestHiddenComponent);
      fixture.detectChanges();
    });

    it('should set display: none on the host element', () => {
      const el = fixture.nativeElement.querySelector('#target');
      expect(el.style.display).toBe('none');
    });

    it('should be detected by By.directive', () => {
      const el = fixture.debugElement.query(By.directive(OHiddenDirective));
      expect(el).toBeTruthy();
    });

    it('should still render the element in the DOM (just hidden)', () => {
      const el = fixture.nativeElement.querySelector('#target');
      expect(el).toBeTruthy();
    });
  });

  describe('on a span element', () => {
    let fixture: ComponentFixture<TestHiddenSpanComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [OHiddenDirective],
        declarations: [TestHiddenSpanComponent]
      });
      fixture = TestBed.createComponent(TestHiddenSpanComponent);
      fixture.detectChanges();
    });

    it('should set display: none on a non-div element', () => {
      const el = fixture.nativeElement.querySelector('#span-target');
      expect(el.style.display).toBe('none');
    });
  });
});
