import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { OLockerDirective } from './locker.directive';

@Component({
  template: `<div oLocker><div class="inner"></div></div>`
})
class TestLockerComponent {}

// ───────────────────────────────────────────────────────────────────────────────

describe('OLockerDirective', () => {
  let fixture: ComponentFixture<TestLockerComponent>;
  let directive: OLockerDirective;
  let lockerEl: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestLockerComponent],
      imports: [OLockerDirective]
    });
    fixture = TestBed.createComponent(TestLockerComponent);
    fixture.detectChanges();
    lockerEl = fixture.debugElement.query(By.directive(OLockerDirective));
    directive = lockerEl.injector.get(OLockerDirective);
  });

  // --- Creation ---

  describe('Creation', () => {
    it('should create the directive', () => {
      expect(directive).toBeTruthy();
    });

    it('should not create a subscription when there is no parent', () => {
      expect((directive as any).subscription).toBeUndefined();
    });
  });

  // --- load mode (default): addLoading / removeLoading ---

  describe('Mode: load — addLoading()', () => {
    it('should add the o-loading element inside the host', () => {
      (directive as any).addLoading();
      expect(lockerEl.nativeElement.querySelector('.o-loading')).toBeTruthy();
    });

    it('should add the relative class to the host', () => {
      (directive as any).addLoading();
      expect(lockerEl.nativeElement.classList.contains('relative')).toBeTrue();
    });

    it('should set opacity 0.6 on the first child element', () => {
      (directive as any).addLoading();
      const inner = lockerEl.nativeElement.querySelector('.inner');
      expect(inner.style.opacity).toBe('0.6');
    });
  });

  describe('Mode: load — removeLoading()', () => {
    beforeEach(() => {
      (directive as any).addLoading();
    });

    it('should remove the o-loading element', () => {
      (directive as any).removeLoading();
      expect(lockerEl.nativeElement.querySelector('.o-loading')).toBeNull();
    });

    it('should remove the relative class from the host', () => {
      (directive as any).removeLoading();
      expect(lockerEl.nativeElement.classList.contains('relative')).toBeFalse();
    });

    it('should restore the opacity of the inner element', () => {
      (directive as any).removeLoading();
      const inner = lockerEl.nativeElement.querySelector('.inner');
      expect(inner.style.opacity).toBe('');
    });
  });

  describe('Mode: load — removeLoading() is a no-op when not loading', () => {
    it('should not throw when called before addLoading', () => {
      expect(() => (directive as any).removeLoading()).not.toThrow();
    });
  });

  // --- disable mode ---

  describe('Mode: disable', () => {
    let mockParent: { enabled: boolean };

    beforeEach(() => {
      mockParent = { enabled: true };
      (directive as any).parent = mockParent;
    });

    it('manageDisableMode(true) should set parent.enabled to false', () => {
      (directive as any).manageDisableMode(true);
      expect(mockParent.enabled).toBeFalse();
    });

    it('manageDisableMode(false) should set parent.enabled to true', () => {
      mockParent.enabled = false;
      (directive as any).manageDisableMode(false);
      expect(mockParent.enabled).toBeTrue();
    });
  });

  // --- oLockerMode setter ---

  describe('Input: oLockerMode', () => {
    it('should update _oLockerMode to "disable"', () => {
      directive.oLockerMode = 'disable' as any;
      expect((directive as any)._oLockerMode).toBe('disable');
    });

    it('should update _oLockerMode to "load"', () => {
      directive.oLockerMode = 'disable' as any;
      directive.oLockerMode = 'load';
      expect((directive as any)._oLockerMode).toBe('load');
    });
  });

  // --- oLockerDelay setter ---

  describe('Input: oLockerDelay', () => {
    it('should update parent.delayLoad', () => {
      const mockParent = { delayLoad: 250 };
      (directive as any).parent = mockParent;
      directive.oLockerDelay = 500;
      expect(mockParent.delayLoad).toBe(500);
    });
  });

  // --- ngOnDestroy ---

  describe('Method: ngOnDestroy()', () => {
    it('should call unsubscribe on the subscription', () => {
      const mockSub = jasmine.createSpyObj('Subscription', ['unsubscribe']);
      (directive as any).subscription = mockSub;
      directive.ngOnDestroy();
      expect(mockSub.unsubscribe).toHaveBeenCalled();
    });
  });
});
