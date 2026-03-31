import { EventEmitter } from '@angular/core';
import { OFormBase } from './o-form-base.class';

// ─── Concrete stub to instantiate the abstract class ─────────────────────────
class OFormBaseStub extends OFormBase {
  executeToolbarAction(_action: string, _options?: any): void { }
  getAttribute(): string { return 'stub'; }
  getComponents(): any { return {}; }
  getFieldReference(_attr: string): any { return null; }
  getFieldReferences(_attrs: string[]): any { return {}; }
  getFormCache(): any { return null; }
  getFormManager(): any { return null; }
  getFormNavigation(): any { return null; }
  getActionsPermissions(): any[] { return []; }
  getKeysValues(): any { return {}; }
  isEditableDetail(): boolean { return false; }
  isInInsertMode(): boolean { return false; }
  registerToolbar(_toolbar: any): void { }
  getRegisteredFieldsValues(): any { return {}; }
  showConfirmDiscardChanges(): Promise<boolean> { return Promise.resolve(true); }
  setInitialMode(): void { }
  setInsertMode(): void { }
  setUpdateMode(): void { }
  setUrlParamsAndReload(_val: object): void { }
  isInitialStateChanged(_ignoreAttrs?: string[]): boolean { return false; }
  getFormToolbar(): any { return null; }
  get isCacheStackEmpty(): boolean { return true; }
  get messageService(): any { return null; }
}

// ─────────────────────────────────────────────────────────────────────────────

describe('OFormBase', () => {
  let form: OFormBaseStub;

  beforeEach(() => {
    form = new OFormBaseStub();
  });

  // ─── Instantiation ──────────────────────────────────────────────────────────

  describe('Instantiation', () => {
    it('should create a concrete subclass instance', () => {
      expect(form).toBeTruthy();
    });

    it('should be an instance of OFormBase', () => {
      expect(form instanceof OFormBase).toBe(true);
    });
  });

  // ─── Property: _pKeysEquiv ──────────────────────────────────────────────────

  describe('Property: _pKeysEquiv', () => {
    it('should initialise _pKeysEquiv as an empty object', () => {
      expect(form._pKeysEquiv).toBeDefined();
      expect(form._pKeysEquiv).toEqual({});
    });

    it('should allow assigning values to _pKeysEquiv', () => {
      form._pKeysEquiv = { id: 'pk_id' };
      expect(form._pKeysEquiv).toEqual({ id: 'pk_id' });
    });
  });

  // ─── Boolean properties ─────────────────────────────────────────────────────

  describe('Boolean properties', () => {
    it('should allow setting confirmExit', () => {
      form.confirmExit = true;
      expect(form.confirmExit).toBe(true);
    });

    it('should allow setting canDiscardChanges', () => {
      form.canDiscardChanges = false;
      expect(form.canDiscardChanges).toBe(false);
    });

    it('should allow setting includeBreadcrumb', () => {
      form.includeBreadcrumb = true;
      expect(form.includeBreadcrumb).toBe(true);
    });

    it('should allow setting isDetailForm', () => {
      form.isDetailForm = true;
      expect(form.isDetailForm).toBe(true);
    });

    it('should allow setting undoButton', () => {
      form.undoButton = false;
      expect(form.undoButton).toBe(false);
    });

    it('should allow setting detectChangesOnBlur', () => {
      form.detectChangesOnBlur = true;
      expect(form.detectChangesOnBlur).toBe(true);
    });
  });

  // ─── Array / object properties ──────────────────────────────────────────────

  describe('Array and object properties', () => {
    it('should allow setting formData', () => {
      form.formData = { name: 'John' };
      expect(form.formData).toEqual({ name: 'John' });
    });

    it('should allow setting ignoreOnExit', () => {
      form.ignoreOnExit = ['attr1', 'attr2'];
      expect(form.ignoreOnExit).toEqual(['attr1', 'attr2']);
    });

    it('should allow setting formParentKeysValues', () => {
      form.formParentKeysValues = { parentId: 1 };
      expect(form.formParentKeysValues).toEqual({ parentId: 1 });
    });

    it('should allow setting keysArray', () => {
      form.keysArray = ['id', 'code'];
      expect(form.keysArray).toEqual(['id', 'code']);
    });

    it('should allow setting keysSqlTypesArray', () => {
      form.keysSqlTypesArray = ['INTEGER', 'VARCHAR'];
      expect(form.keysSqlTypesArray).toEqual(['INTEGER', 'VARCHAR']);
    });
  });

  // ─── EventEmitter properties ────────────────────────────────────────────────

  describe('EventEmitter properties', () => {
    beforeEach(() => {
      form.onInsert = new EventEmitter<any>();
      form.onUpdate = new EventEmitter<any>();
      form.onDelete = new EventEmitter<any>();
      form.onCancel = new EventEmitter<null>();
      form.beforeUpdateMode = new EventEmitter<null>();
      form.onDataLoaded = new EventEmitter<object>();
      form.beforeCloseDetail = new EventEmitter<any>();
    });

    it('should allow assigning onInsert EventEmitter', () => {
      expect(form.onInsert).toBeDefined();
      expect(typeof form.onInsert.emit).toBe('function');
    });

    it('should allow assigning onUpdate EventEmitter', () => {
      expect(form.onUpdate).toBeDefined();
      expect(typeof form.onUpdate.emit).toBe('function');
    });

    it('should allow assigning onDelete EventEmitter', () => {
      expect(form.onDelete).toBeDefined();
      expect(typeof form.onDelete.emit).toBe('function');
    });

    it('should allow assigning onCancel EventEmitter', () => {
      expect(form.onCancel).toBeDefined();
      expect(typeof form.onCancel.emit).toBe('function');
    });

    it('should allow assigning beforeUpdateMode EventEmitter', () => {
      expect(form.beforeUpdateMode).toBeDefined();
      expect(typeof form.beforeUpdateMode.emit).toBe('function');
    });

    it('should allow assigning onDataLoaded EventEmitter', () => {
      expect(form.onDataLoaded).toBeDefined();
      expect(typeof form.onDataLoaded.emit).toBe('function');
    });

    it('should allow assigning beforeCloseDetail EventEmitter', () => {
      expect(form.beforeCloseDetail).toBeDefined();
      expect(typeof form.beforeCloseDetail.emit).toBe('function');
    });

    it('should emit values through onInsert', () => {
      const received: any[] = [];
      form.onInsert.subscribe((v: any) => received.push(v));
      form.onInsert.emit({ id: 1 });
      expect(received).toEqual([{ id: 1 }]);
    });

    it('should emit values through onUpdate', () => {
      const received: any[] = [];
      form.onUpdate.subscribe((v: any) => received.push(v));
      form.onUpdate.emit({ id: 2 });
      expect(received).toEqual([{ id: 2 }]);
    });

    it('should emit values through onDelete', () => {
      const received: any[] = [];
      form.onDelete.subscribe((v: any) => received.push(v));
      form.onDelete.emit({ id: 3 });
      expect(received).toEqual([{ id: 3 }]);
    });

    it('should emit null through onCancel', () => {
      const received: any[] = [];
      form.onCancel.subscribe((v: any) => received.push(v));
      form.onCancel.emit(null);
      expect(received).toEqual([null]);
    });

    it('should emit null through beforeUpdateMode', () => {
      const received: any[] = [];
      form.beforeUpdateMode.subscribe((v: any) => received.push(v));
      form.beforeUpdateMode.emit(null);
      expect(received).toEqual([null]);
    });

    it('should emit object through onDataLoaded', () => {
      const received: any[] = [];
      form.onDataLoaded.subscribe((v: any) => received.push(v));
      form.onDataLoaded.emit({ data: 'loaded' });
      expect(received).toEqual([{ data: 'loaded' }]);
    });

    it('should emit through beforeCloseDetail', () => {
      const received: any[] = [];
      form.beforeCloseDetail.subscribe((v: any) => received.push(v));
      form.beforeCloseDetail.emit('closing');
      expect(received).toEqual(['closing']);
    });
  });

  // ─── Abstract method contract ───────────────────────────────────────────────

  describe('Abstract method contract (via stub)', () => {
    it('should have executeToolbarAction method', () => {
      expect(typeof form.executeToolbarAction).toBe('function');
    });

    it('should have getAttribute method returning a string', () => {
      expect(typeof form.getAttribute).toBe('function');
      expect(typeof form.getAttribute()).toBe('string');
    });

    it('should have getComponents method', () => {
      expect(typeof form.getComponents).toBe('function');
      expect(form.getComponents()).toBeDefined();
    });

    it('should have getFieldReference method', () => {
      expect(typeof form.getFieldReference).toBe('function');
    });

    it('should have getFieldReferences method', () => {
      expect(typeof form.getFieldReferences).toBe('function');
    });

    it('should have getFormCache method', () => {
      expect(typeof form.getFormCache).toBe('function');
    });

    it('should have getFormManager method', () => {
      expect(typeof form.getFormManager).toBe('function');
    });

    it('should have getFormNavigation method', () => {
      expect(typeof form.getFormNavigation).toBe('function');
    });

    it('should have getActionsPermissions method returning array', () => {
      expect(typeof form.getActionsPermissions).toBe('function');
      expect(Array.isArray(form.getActionsPermissions())).toBe(true);
    });

    it('should have getKeysValues method', () => {
      expect(typeof form.getKeysValues).toBe('function');
    });

    it('should have isEditableDetail method returning boolean', () => {
      expect(typeof form.isEditableDetail).toBe('function');
      expect(typeof form.isEditableDetail()).toBe('boolean');
    });

    it('should have isInInsertMode method returning boolean', () => {
      expect(typeof form.isInInsertMode).toBe('function');
      expect(typeof form.isInInsertMode()).toBe('boolean');
    });

    it('should have registerToolbar method', () => {
      expect(typeof form.registerToolbar).toBe('function');
    });

    it('should have getRegisteredFieldsValues method', () => {
      expect(typeof form.getRegisteredFieldsValues).toBe('function');
    });

    it('should have showConfirmDiscardChanges method returning a Promise', () => {
      expect(typeof form.showConfirmDiscardChanges).toBe('function');
      expect(form.showConfirmDiscardChanges() instanceof Promise).toBe(true);
    });

    it('should have setInitialMode method', () => {
      expect(typeof form.setInitialMode).toBe('function');
      expect(() => form.setInitialMode()).not.toThrow();
    });

    it('should have setInsertMode method', () => {
      expect(typeof form.setInsertMode).toBe('function');
      expect(() => form.setInsertMode()).not.toThrow();
    });

    it('should have setUpdateMode method', () => {
      expect(typeof form.setUpdateMode).toBe('function');
      expect(() => form.setUpdateMode()).not.toThrow();
    });

    it('should have setUrlParamsAndReload method', () => {
      expect(typeof form.setUrlParamsAndReload).toBe('function');
      expect(() => form.setUrlParamsAndReload({ id: 1 })).not.toThrow();
    });

    it('should have isInitialStateChanged method returning boolean', () => {
      expect(typeof form.isInitialStateChanged).toBe('function');
      expect(typeof form.isInitialStateChanged()).toBe('boolean');
    });

    it('should have getFormToolbar method', () => {
      expect(typeof form.getFormToolbar).toBe('function');
    });

    it('should have isCacheStackEmpty getter returning boolean', () => {
      expect(typeof form.isCacheStackEmpty).toBe('boolean');
    });

    it('should have messageService getter', () => {
      expect('messageService' in form).toBe(true);
    });
  });

  // ─── formContainer property ─────────────────────────────────────────────────

  describe('Property: formContainer', () => {
    it('should allow assigning formContainer', () => {
      const mockContainer = {} as any;
      form.formContainer = mockContainer;
      expect(form.formContainer).toBe(mockContainer);
    });
  });
});
