import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { OMatErrorDirective } from './o-mat-error.directive';
import { O_MAT_ERROR_OPTIONS } from '../injection-tokens';
import { Codes } from '../util/codes';

// ─── Standard mode ─────────────────────────────────────────────────────────────

@Component({
  template: `<ng-template [oMatError]="show"><span class="err-content">Error!</span></ng-template>`
})
class TestMatErrorStandardComponent {
  show = false;
  @ViewChild(OMatErrorDirective) directive: OMatErrorDirective;
}

// ─── Lite mode ─────────────────────────────────────────────────────────────────

@Component({
  template: `<ng-template [oMatError]="show"><span class="err-content">Error!</span></ng-template>`
})
class TestMatErrorLiteComponent {
  show = false;
  @ViewChild(OMatErrorDirective) directive: OMatErrorDirective;
}

// ───────────────────────────────────────────────────────────────────────────────

describe('OMatErrorDirective', () => {

  // ─── Standard mode ───────────────────────────────────────────────────────────

  describe('standard mode', () => {
    let fixture: ComponentFixture<TestMatErrorStandardComponent>;
    let component: TestMatErrorStandardComponent;
    let directive: OMatErrorDirective;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [OMatErrorDirective, TestMatErrorStandardComponent],
        providers: [
          { provide: O_MAT_ERROR_OPTIONS, useValue: { type: Codes.O_MAT_ERROR_STANDARD } }
        ]
      });
      fixture = TestBed.createComponent(TestMatErrorStandardComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      directive = component.directive;
    });

    // --- Creation ---

    describe('Creation', () => {
      it('should be created', () => {
        expect(directive).toBeTruthy();
      });

      it('should not render template content on init (show = false)', () => {
        expect(fixture.nativeElement.querySelector('.err-content')).toBeNull();
      });
    });

    // --- oMatError setter ---

    describe('Input: oMatError', () => {
      it('should render embedded view when set to true', () => {
        component.show = true;
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.err-content')).toBeTruthy();
      });

      it('should clear embedded view when set back to false', () => {
        component.show = true;
        fixture.detectChanges();
        component.show = false;
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.err-content')).toBeNull();
      });

      it('should clear text property when set to false', () => {
        component.show = true;
        fixture.detectChanges();
        directive.text = 'some error';
        component.show = false;
        fixture.detectChanges();
        expect(directive.text).toBeUndefined();
      });

      it('should render multiple times when toggled', () => {
        component.show = true;
        fixture.detectChanges();
        component.show = false;
        fixture.detectChanges();
        component.show = true;
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.err-content')).toBeTruthy();
      });
    });
  });

  // ─── Lite mode ───────────────────────────────────────────────────────────────

  describe('lite mode', () => {
    let fixture: ComponentFixture<TestMatErrorLiteComponent>;
    let component: TestMatErrorLiteComponent;
    let directive: OMatErrorDirective;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [OMatErrorDirective, TestMatErrorLiteComponent],
        providers: [
          { provide: O_MAT_ERROR_OPTIONS, useValue: { type: Codes.O_MAT_ERROR_LITE } }
        ]
      });
      fixture = TestBed.createComponent(TestMatErrorLiteComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      directive = component.directive;
    });

    it('should be created in lite mode', () => {
      expect(directive).toBeTruthy();
    });

    it('should clear embedded view after timeout when set to true', fakeAsync(() => {
      component.show = true;
      fixture.detectChanges();
      tick(0);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.err-content')).toBeNull();
    }));

    it('should set text to undefined when oMatError is false', () => {
      component.show = true;
      fixture.detectChanges();
      directive.text = 'previous error';
      component.show = false;
      fixture.detectChanges();
      expect(directive.text).toBeUndefined();
    });
  });
});
