import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { OMatSuffix } from './o-mat-suffix.directive';

@Component({
  template: `<span oMatSuffix>suffix</span>`
})
class TestMatSuffixComponent {}

describe('OMatSuffix', () => {
  let fixture: ComponentFixture<TestMatSuffixComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OMatSuffix],
      declarations: [TestMatSuffixComponent]
    });
    fixture = TestBed.createComponent(TestMatSuffixComponent);
    fixture.detectChanges();
  });

  it('should be created', () => {
    const el = fixture.debugElement.query(By.directive(OMatSuffix));
    expect(el).toBeTruthy();
    expect(el.injector.get(OMatSuffix)).toBeTruthy();
  });

  it('should be detected on the host element', () => {
    const el = fixture.debugElement.query(By.directive(OMatSuffix));
    expect(el.nativeElement.tagName.toLowerCase()).toBe('span');
  });

  it('should be instantiable directly', () => {
    expect(new OMatSuffix()).toBeTruthy();
  });
});
