import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { OMatPrefix } from './o-mat-prefix.directive';

@Component({
  template: `<span oMatPrefix>prefix</span>`
})
class TestMatPrefixComponent {}

describe('OMatPrefix', () => {
  let fixture: ComponentFixture<TestMatPrefixComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OMatPrefix],
      declarations: [TestMatPrefixComponent]
    });
    fixture = TestBed.createComponent(TestMatPrefixComponent);
    fixture.detectChanges();
  });

  it('should be created', () => {
    const el = fixture.debugElement.query(By.directive(OMatPrefix));
    expect(el).toBeTruthy();
    expect(el.injector.get(OMatPrefix)).toBeTruthy();
  });

  it('should be detected on the host element', () => {
    const el = fixture.debugElement.query(By.directive(OMatPrefix));
    expect(el.nativeElement.tagName.toLowerCase()).toBe('span');
  });

  it('should be instantiable directly (no logic inside)', () => {
    expect(new OMatPrefix()).toBeTruthy();
  });
});
