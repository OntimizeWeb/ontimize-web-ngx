import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { OFileDragAndDropDirective } from './o-file-drag-and-drop.directive';

@Component({
  template: `<div oFileDragAndDrop (onFileDropped)="onFiles($event)"></div>`
})
class TestFileDragComponent {
  receivedFiles: File[] | null = null;
  onFiles(files: File[]) { this.receivedFiles = files; }
}

describe('OFileDragAndDropDirective', () => {
  let fixture: ComponentFixture<TestFileDragComponent>;
  let component: TestFileDragComponent;
  let directive: OFileDragAndDropDirective;
  let el: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OFileDragAndDropDirective, TestFileDragComponent]
    });
    fixture = TestBed.createComponent(TestFileDragComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.debugElement.query(By.directive(OFileDragAndDropDirective));
    directive = el.injector.get(OFileDragAndDropDirective);
  });

  // --- Creation ---

  describe('Creation', () => {
    it('should be created', () => {
      expect(directive).toBeTruthy();
    });

    it('fileDragging should be false initially', () => {
      expect(directive.fileDragging).toBeFalsy();
    });
  });

  // --- onDragOver ---

  describe('HostListener: onDragOver()', () => {
    it('should set fileDragging to true', () => {
      const evt = { preventDefault: jasmine.createSpy(), stopPropagation: jasmine.createSpy() } as any;
      directive.onDragOver(evt);
      expect(directive.fileDragging).toBeTrue();
    });

    it('should call preventDefault and stopPropagation', () => {
      const evt = { preventDefault: jasmine.createSpy(), stopPropagation: jasmine.createSpy() } as any;
      directive.onDragOver(evt);
      expect(evt.preventDefault).toHaveBeenCalled();
      expect(evt.stopPropagation).toHaveBeenCalled();
    });
  });

  // --- onDragLeave ---

  describe('HostListener: onDragLeave()', () => {
    it('should set fileDragging to false', () => {
      directive.fileDragging = true;
      const evt = { preventDefault: jasmine.createSpy(), stopPropagation: jasmine.createSpy() } as any;
      directive.onDragLeave(evt);
      expect(directive.fileDragging).toBeFalse();
    });

    it('should call preventDefault and stopPropagation', () => {
      const evt = { preventDefault: jasmine.createSpy(), stopPropagation: jasmine.createSpy() } as any;
      directive.onDragLeave(evt);
      expect(evt.preventDefault).toHaveBeenCalled();
      expect(evt.stopPropagation).toHaveBeenCalled();
    });
  });

  // --- onDrop ---

  describe('HostListener: onDrop()', () => {
    let emitSpy: jasmine.Spy;

    beforeEach(() => {
      emitSpy = spyOn(directive['onFileDropped'], 'emit');
    });

    it('should set fileDragging to false', () => {
      directive.fileDragging = true;
      const evt = { preventDefault: jasmine.createSpy(), stopPropagation: jasmine.createSpy(), dataTransfer: { files: [] } } as any;
      directive.onDrop(evt);
      expect(directive.fileDragging).toBeFalse();
    });

    it('should call preventDefault and stopPropagation', () => {
      const evt = { preventDefault: jasmine.createSpy(), stopPropagation: jasmine.createSpy(), dataTransfer: { files: [] } } as any;
      directive.onDrop(evt);
      expect(evt.preventDefault).toHaveBeenCalled();
      expect(evt.stopPropagation).toHaveBeenCalled();
    });

    it('should emit dropped files when files are present', () => {
      const mockFiles = [new File(['content'], 'test.txt')] as unknown as FileList;
      (mockFiles as any).length = 1;
      const evt = { preventDefault: jasmine.createSpy(), stopPropagation: jasmine.createSpy(), dataTransfer: { files: mockFiles } } as any;
      directive.onDrop(evt);
      expect(emitSpy).toHaveBeenCalledWith(mockFiles);
    });

    it('should NOT emit when drop contains no files', () => {
      const mockFiles = [] as unknown as FileList;
      (mockFiles as any).length = 0;
      const evt = { preventDefault: jasmine.createSpy(), stopPropagation: jasmine.createSpy(), dataTransfer: { files: mockFiles } } as any;
      directive.onDrop(evt);
      expect(emitSpy).not.toHaveBeenCalled();
    });
  });
});
