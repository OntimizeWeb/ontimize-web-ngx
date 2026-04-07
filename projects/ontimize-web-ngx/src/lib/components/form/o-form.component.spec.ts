import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup, UntypedFormControl } from '@angular/forms';

import { OTestingUtils } from '../../shared/testing/o-testing-utils';
import { OFormValue } from './o-form-value';
import { OFormConfirmExitService } from './navigation/o-form-confirm-exit.service';
import { Codes } from '../../util/codes';
import { SQLTypes } from '../../util/sqltypes';

let OFormComponent: any;

describe('OFormComponent', () => {
  let component: any;
  let fixture: any;

  beforeEach(async () => {
    const module = await import('./o-form.component');
    OFormComponent = module.OFormComponent;

    await TestBed.configureTestingModule({
      declarations: [...OTestingUtils.getCommonDeclarations()],
      imports: [
        OFormComponent,
        RouterTestingModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        OFormConfirmExitService,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(OFormComponent);
    component = fixture.componentInstance;
    // Provide formGroup without triggering full ngOnInit
    component.formGroup = new UntypedFormGroup({});
  });

  // ─── Creation ────────────────────────────────────────────────────────────────

  describe('Creation', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should be an instance of OFormComponent', () => {
      expect(component instanceof OFormComponent).toBe(true);
    });

    it('should have formGroup defined after setup', () => {
      expect(component.formGroup).toBeDefined();
    });
  });

  // ─── Static Mode() ───────────────────────────────────────────────────────────

  describe('Static: Mode()', () => {
    it('should return an object with INITIAL mode', () => {
      const modes = OFormComponent.Mode();
      expect(modes.INITIAL).toBeDefined();
    });

    it('should return an object with INSERT mode', () => {
      expect(OFormComponent.Mode().INSERT).toBeDefined();
    });

    it('should return an object with UPDATE mode', () => {
      expect(OFormComponent.Mode().UPDATE).toBeDefined();
    });

    it('should return an object with QUERY mode', () => {
      expect(OFormComponent.Mode().QUERY).toBeDefined();
    });

    it('should have different values for each mode', () => {
      const m = OFormComponent.Mode();
      const values = new Set([m.INITIAL, m.INSERT, m.UPDATE, m.QUERY]);
      expect(values.size).toBe(4);
    });
  });

  // ─── Default inputs ──────────────────────────────────────────────────────────

  describe('Default input values', () => {
    it('should have showHeader true by default', () => {
      expect(component.showHeader).toBe(true);
    });

    it('should have headerMode floating by default', () => {
      expect(component.headerMode).toBe('floating');
    });

    it('should have headerPosition top by default', () => {
      expect(component.headerPosition).toBe('top');
    });

    it('should have confirmExit true by default', () => {
      expect(component.confirmExit).toBe(true);
    });

    it('should have undoButton true by default', () => {
      expect(component.undoButton).toBe(true);
    });

    it('should have detectChangesOnBlur true by default', () => {
      expect(component.detectChangesOnBlur).toBe(true);
    });

    it('should have stayInRecordAfterEdit false by default', () => {
      expect(component.stayInRecordAfterEdit).toBe(false);
    });

    it('should have afterInsertMode close by default', () => {
      expect(component.afterInsertMode).toBe('close');
    });

    it('should have mode INITIAL by default', () => {
      expect(component.mode).toBe(OFormComponent.Mode().INITIAL);
    });

    it('should have headeractions all by default', () => {
      expect(component.headeractions).toBe('all');
    });

    it('should have isDetailForm false by default', () => {
      expect(component.isDetailForm).toBe(false);
    });

    it('should have keysArray empty by default', () => {
      expect(component.keysArray).toEqual([]);
    });

    it('should have colsArray empty by default', () => {
      expect(component.colsArray).toEqual([]);
    });
  });

  // ─── getAttribute() ──────────────────────────────────────────────────────────

  describe('Method: getAttribute()', () => {
    it('should return oattr when set', () => {
      component.oattr = 'myForm';
      expect(component.getAttribute()).toBe('myForm');
    });

    it('should return undefined when oattr is empty string', () => {
      component.oattr = '';
      expect(component.getAttribute()).toBeUndefined();
    });
  });

  // ─── layoutDirection getter/setter ───────────────────────────────────────────

  describe('Property: layoutDirection', () => {
    it('should accept column direction', () => {
      component.layoutDirection = 'column';
      expect(component.layoutDirection).toBe('column');
    });

    it('should accept row direction', () => {
      component.layoutDirection = 'row';
      expect(component.layoutDirection).toBe('row');
    });

    it('should accept row-reverse direction', () => {
      component.layoutDirection = 'row-reverse';
      expect(component.layoutDirection).toBe('row-reverse');
    });

    it('should accept column-reverse direction', () => {
      component.layoutDirection = 'column-reverse';
      expect(component.layoutDirection).toBe('column-reverse');
    });

    it('should fall back to default for invalid direction', () => {
      component.layoutDirection = 'diagonal';
      expect(component.layoutDirection).toBe(OFormComponent.DEFAULT_LAYOUT_DIRECTION);
    });

    it('should be case-insensitive', () => {
      component.layoutDirection = 'ROW';
      expect(component.layoutDirection).toBe('row');
    });

    it('should default to column on empty string', () => {
      component.layoutDirection = '';
      expect(component.layoutDirection).toBe(OFormComponent.DEFAULT_LAYOUT_DIRECTION);
    });
  });

  // ─── layoutAlign getter/setter ───────────────────────────────────────────────

  describe('Property: layoutAlign', () => {
    it('should set and get layoutAlign', () => {
      component.layoutAlign = 'center center';
      expect(component.layoutAlign).toBe('center center');
    });

    it('should set and get start stretch', () => {
      component.layoutAlign = 'start stretch';
      expect(component.layoutAlign).toBe('start stretch');
    });
  });

  // ─── showFloatingToolbar / showNotFloatingToolbar ─────────────────────────────

  describe('Property: showFloatingToolbar / showNotFloatingToolbar', () => {
    it('should be true when showHeader=true and headerMode=floating', () => {
      component.showHeader = true;
      component.headerMode = 'floating';
      expect(component.showFloatingToolbar).toBe(true);
    });

    it('should be false when showHeader=false', () => {
      component.showHeader = false;
      component.headerMode = 'floating';
      expect(component.showFloatingToolbar).toBe(false);
    });

    it('should be false when headerMode is not floating', () => {
      component.showHeader = true;
      component.headerMode = 'none';
      expect(component.showFloatingToolbar).toBe(false);
    });

    it('showNotFloatingToolbar should be true when showHeader=true and mode!=floating', () => {
      component.showHeader = true;
      component.headerMode = 'none';
      expect(component.showNotFloatingToolbar).toBe(true);
    });

    it('showNotFloatingToolbar should be false when showHeader=false', () => {
      component.showHeader = false;
      component.headerMode = 'none';
      expect(component.showNotFloatingToolbar).toBe(false);
    });

    it('showNotFloatingToolbar should be false when headerMode=floating', () => {
      component.showHeader = true;
      component.headerMode = 'floating';
      expect(component.showNotFloatingToolbar).toBe(false);
    });
  });

  // ─── isEditableDetail() ──────────────────────────────────────────────────────

  describe('Method: isEditableDetail()', () => {
    it('should return true when editableDetail is true', () => {
      (component as any).editableDetail = true;
      expect(component.isEditableDetail()).toBe(true);
    });

    it('should return false when editableDetail is false', () => {
      (component as any).editableDetail = false;
      expect(component.isEditableDetail()).toBe(false);
    });
  });

  // ─── Mode check methods ──────────────────────────────────────────────────────

  describe('Mode check methods', () => {
    it('isInInitialMode() should return true when mode is INITIAL', () => {
      component.mode = OFormComponent.Mode().INITIAL;
      expect(component.isInInitialMode()).toBe(true);
    });

    it('isInInsertMode() should return true when mode is INSERT', () => {
      component.mode = OFormComponent.Mode().INSERT;
      expect(component.isInInsertMode()).toBe(true);
    });

    it('isInUpdateMode() should return true when mode is UPDATE', () => {
      component.mode = OFormComponent.Mode().UPDATE;
      expect(component.isInUpdateMode()).toBe(true);
    });

    it('isInQueryMode() should return true when mode is QUERY', () => {
      component.mode = OFormComponent.Mode().QUERY;
      expect(component.isInQueryMode()).toBe(true);
    });

    it('should not be in multiple modes simultaneously', () => {
      component.mode = OFormComponent.Mode().INSERT;
      expect(component.isInInsertMode()).toBe(true);
      expect(component.isInUpdateMode()).toBe(false);
      expect(component.isInInitialMode()).toBe(false);
    });
  });

  // ─── ignoreOnExit getter/setter ───────────────────────────────────────────────

  describe('Property: ignoreOnExit', () => {
    it('should accept a string array', () => {
      component.ignoreOnExit = ['field1', 'field2'];
      expect(component.ignoreOnExit).toEqual(['field1', 'field2']);
    });

    it('should parse a semicolon-delimited string', () => {
      component.ignoreOnExit = 'attr1;attr2;attr3' as any;
      expect(Array.isArray(component.ignoreOnExit)).toBe(true);
      expect(component.ignoreOnExit.length).toBe(3);
    });

    it('should return undefined when not set', () => {
      expect(component.ignoreOnExit).toBeUndefined();
    });
  });

  // ─── getComponents() ─────────────────────────────────────────────────────────

  describe('Method: getComponents()', () => {
    it('should return an empty object by default', () => {
      expect(component.getComponents()).toEqual({});
    });

    it('should return registered components', () => {
      (component as any)._components = { myAttr: {} as any };
      expect(component.getComponents()).toEqual({ myAttr: {} as any });
    });
  });

  // ─── getFieldReference() / getFieldReferences() ───────────────────────────────

  describe('Method: getFieldReference() / getFieldReferences()', () => {
    beforeEach(() => {
      (component as any)._components = {
        name: { getValue: () => 'John' } as any,
        age: { getValue: () => 30 } as any
      };
    });

    it('should return the component for a known attr', () => {
      expect(component.getFieldReference('name')).toBeDefined();
    });

    it('should return undefined for unknown attr', () => {
      expect(component.getFieldReference('unknown')).toBeUndefined();
    });

    it('getFieldReferences should return a hash of components', () => {
      const refs = component.getFieldReferences(['name', 'age']);
      expect(refs['name']).toBeDefined();
      expect(refs['age']).toBeDefined();
    });

    it('getFieldReferences should return undefined for missing attrs', () => {
      const refs = component.getFieldReferences(['name', 'missing']);
      expect(refs['missing']).toBeUndefined();
    });
  });

  // ─── getFieldValue() / setFieldValue() / clearFieldValue() ───────────────────

  describe('Method: getFieldValue() / setFieldValue() / clearFieldValue()', () => {
    let mockComp: any;

    beforeEach(() => {
      mockComp = {
        getValue: jasmine.createSpy('getValue').and.returnValue('hello'),
        setValue: jasmine.createSpy('setValue'),
        clearValue: jasmine.createSpy('clearValue')
      };
      (component as any)._components = { field1: mockComp };
    });

    it('getFieldValue should return component value', () => {
      expect(component.getFieldValue('field1')).toBe('hello');
    });

    it('getFieldValue should return null for unknown attr', () => {
      expect(component.getFieldValue('unknown')).toBeNull();
    });

    it('getFieldValues should return a hash of values', () => {
      const vals = component.getFieldValues(['field1']);
      expect(vals['field1']).toBe('hello');
    });

    it('setFieldValue should call setValue on the component', () => {
      component.setFieldValue('field1', 'world');
      expect(mockComp.setValue).toHaveBeenCalledWith('world', undefined);
    });

    it('setFieldValue should not throw for unknown attr', () => {
      expect(() => component.setFieldValue('unknown', 'val')).not.toThrow();
    });

    it('setFieldValues should call setValue for each key', () => {
      component.setFieldValues({ field1: 'test' });
      expect(mockComp.setValue).toHaveBeenCalledWith('test', undefined);
    });

    it('clearFieldValue should call clearValue on the component', () => {
      component.clearFieldValue('field1');
      expect(mockComp.clearValue).toHaveBeenCalled();
    });

    it('clearFieldValue should not throw for unknown attr', () => {
      expect(() => component.clearFieldValue('unknown')).not.toThrow();
    });

    it('clearFieldValues should call clearValue for each attr', () => {
      component.clearFieldValues(['field1']);
      expect(mockComp.clearValue).toHaveBeenCalled();
    });
  });

  // ─── toJSONData() ────────────────────────────────────────────────────────────

  describe('Method: toJSONData()', () => {
    it('should extract .value from each property', () => {
      const input = { name: new OFormValue('John'), age: new OFormValue(30) };
      expect(component.toJSONData(input)).toEqual({ name: 'John', age: 30 });
    });

    it('should return empty object for null input', () => {
      expect(component.toJSONData(null)).toEqual({});
    });

    it('should return empty object for undefined input', () => {
      expect(component.toJSONData(undefined)).toEqual({});
    });
  });

  // ─── toFormValueData() ───────────────────────────────────────────────────────

  describe('Method: toFormValueData()', () => {
    it('should wrap each property in OFormValue for a plain object', () => {
      const result: any = component.toFormValueData({ name: 'Alice', age: 25 });
      expect(result['name'] instanceof OFormValue).toBe(true);
      expect(result['name'].value).toBe('Alice');
    });

    it('should return undefined for falsy input', () => {
      expect(component.toFormValueData(null)).toBeUndefined();
    });

    it('should handle an array of objects', () => {
      const result = component.toFormValueData([{ id: 1 }, { id: 2 }]);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
    });
  });

  // ─── getDataValues() ─────────────────────────────────────────────────────────

  describe('Method: getDataValues()', () => {
    it('should return formData', () => {
      component.formData = { key: 'value' };
      expect(component.getDataValues()).toEqual({ key: 'value' });
    });
  });

  // ─── getAttributesSQLTypes() ─────────────────────────────────────────────────

  describe('Method: getAttributesSQLTypes()', () => {
    it('should return an empty object when no keys or sql types set', () => {
      component.keysArray = [];
      component.keysSqlTypesArray = [];
      (component as any)._compSQLTypes = {};
      expect(component.getAttributesSQLTypes()).toEqual({});
    });

    it('should include component sql types', () => {
      component.keysArray = [];
      component.keysSqlTypesArray = [];
      (component as any)._compSQLTypes = { name: SQLTypes.VARCHAR };
      const types = component.getAttributesSQLTypes();
      expect(types['name']).toBe(SQLTypes.VARCHAR);
    });
  });

  // ─── registerFormComponent() / unregisterFormComponent() ─────────────────────

  describe('Method: registerFormComponent() / unregisterFormComponent()', () => {
    it('should register a component by attr', () => {
      const mockComp = {
        getAttribute: () => 'testAttr',
        isAutomaticRegistering: () => true,
        setValue: jasmine.createSpy('setValue')
      };
      component.registerFormComponent(mockComp);
      expect((component as any)._components['testAttr']).toBe(mockComp);
    });

    it('should not register when isAutomaticRegistering returns false', () => {
      const mockComp = {
        getAttribute: () => 'noReg',
        isAutomaticRegistering: () => false
      };
      component.registerFormComponent(mockComp);
      expect((component as any)._components['noReg']).toBeUndefined();
    });

    it('should not register when attr is empty', () => {
      const mockComp = {
        getAttribute: () => '',
        isAutomaticRegistering: () => true
      };
      component.registerFormComponent(mockComp);
      expect(Object.keys((component as any)._components)).not.toContain('');
    });

    it('should not throw when comp is null', () => {
      expect(() => component.registerFormComponent(null)).not.toThrow();
    });

    it('unregister should remove a registered component', () => {
      (component as any)._components['myAttr'] = {};
      const mockComp = { getAttribute: () => 'myAttr' };
      component.unregisterFormComponent(mockComp);
      expect((component as any)._components['myAttr']).toBeUndefined();
    });

    it('unregister should not throw for unknown attr', () => {
      const mockComp = { getAttribute: () => 'unknown' };
      expect(() => component.unregisterFormComponent(mockComp)).not.toThrow();
    });
  });

  // ─── registerSQLTypeFormComponent() / unregisterSQLTypeFormComponent() ────────

  describe('Method: registerSQLTypeFormComponent() / unregisterSQLTypeFormComponent()', () => {
    it('should store sql type for component', () => {
      component.ignoreFormCacheKeys = [];
      const mockComp = {
        getAttribute: () => 'price',
        getSQLType: () => SQLTypes.FLOAT,
        repeatedAttr: false
      };
      component.registerSQLTypeFormComponent(mockComp);
      expect((component as any)._compSQLTypes['price']).toBe(SQLTypes.FLOAT);
    });

    it('should not store OTHER sql type', () => {
      component.ignoreFormCacheKeys = [];
      const mockComp = {
        getAttribute: () => 'desc',
        getSQLType: () => SQLTypes.OTHER,
        repeatedAttr: false
      };
      component.registerSQLTypeFormComponent(mockComp);
      expect((component as any)._compSQLTypes['desc']).toBeUndefined();
    });

    it('unregister should remove the sql type', () => {
      (component as any)._compSQLTypes['price'] = SQLTypes.FLOAT;
      const mockComp = { getAttribute: () => 'price' };
      component.unregisterSQLTypeFormComponent(mockComp);
      expect((component as any)._compSQLTypes['price']).toBeUndefined();
    });
  });

  // ─── registerFormControlComponent() / unregisterFormControlComponent() ────────

  describe('Method: registerFormControlComponent() / unregisterFormControlComponent()', () => {
    it('should add a control to the formGroup', () => {
      const ctrl = new UntypedFormControl('');
      const mockComp = {
        getAttribute: () => 'emailField',
        getControl: () => ctrl,
        isAutomaticRegistering: () => true,
        repeatedAttr: false
      };
      component.registerFormControlComponent(mockComp);
      expect(component.formGroup.contains('emailField')).toBe(true);
    });

    it('should skip registration when repeatedAttr is true', () => {
      const ctrl = new UntypedFormControl('');
      const mockComp = {
        getAttribute: () => 'skippedField',
        getControl: () => ctrl,
        isAutomaticRegistering: () => true,
        repeatedAttr: true
      };
      component.registerFormControlComponent(mockComp);
      expect(component.formGroup.contains('skippedField')).toBe(false);
    });

    it('unregister should remove control from formGroup', () => {
      const ctrl = new UntypedFormControl('');
      component.formGroup.addControl('toRemove', ctrl);
      const mockComp = {
        getAttribute: () => 'toRemove',
        getControl: () => ctrl,
        isAutomaticRegistering: () => true
      };
      component.unregisterFormControlComponent(mockComp);
      expect(component.formGroup.contains('toRemove')).toBe(false);
    });
  });

  // ─── registerToolbar() ───────────────────────────────────────────────────────

  describe('Method: registerToolbar()', () => {
    it('should set _formToolbar', () => {
      const mockToolbar = { isDetail: false, setInitialMode: () => { }, setInsertMode: () => { }, setEditMode: () => { } };
      component.registerToolbar(mockToolbar);
      expect((component as any)._formToolbar).toBe(mockToolbar);
    });

    it('should not throw when toolbar is null', () => {
      expect(() => component.registerToolbar(null)).not.toThrow();
    });
  });

  // ─── getFormCache() / getFormNavigation() / getFormToolbar() ─────────────────

  describe('Getters: getFormCache / getFormNavigation / getFormToolbar', () => {
    it('getFormCache should return formCache', () => {
      expect(component.getFormCache()).toBeDefined();
    });

    it('getFormNavigation should return formNavigation', () => {
      expect(component.getFormNavigation()).toBeDefined();
    });

    it('getFormToolbar should return _formToolbar', () => {
      (component as any)._formToolbar = {} as any;
      expect(component.getFormToolbar()).toBeDefined();
    });
  });

  // ─── getKeysValues() ─────────────────────────────────────────────────────────

  describe('Method: getKeysValues()', () => {
    it('should return filter with key values from formData', () => {
      component.keysArray = ['id'];
      component.formData = { id: new OFormValue(42) };
      const filter = component.getKeysValues();
      expect(filter['id']).toBe(42);
    });

    it('should skip keys not present in formData', () => {
      component.keysArray = ['id', 'code'];
      component.formData = { id: new OFormValue(1) };
      const filter = component.getKeysValues();
      expect(filter['id']).toBe(1);
      expect(filter['code']).toBeUndefined();
    });

    it('should return empty filter when keysArray is empty', () => {
      component.keysArray = [];
      component.formData = {};
      expect(component.getKeysValues()).toEqual({});
    });
  });

  // ─── setData() ───────────────────────────────────────────────────────────────

  describe('Method: setData()', () => {
    beforeEach(() => {
      spyOn(component, '_updateFormData').and.callFake(() => { });
      spyOn(component, '_emitData').and.callFake(() => { });
    });

    it('should call _updateFormData and _emitData for a single-item array', () => {
      component.setData([{ name: 'Alice' }]);
      expect((component as any)._updateFormData).toHaveBeenCalled();
      expect((component as any)._emitData).toHaveBeenCalledWith({ name: 'Alice' });
    });

    it('should use empty object for array with more than one item', () => {
      component.setData([{ id: 1 }, { id: 2 }]);
      expect((component as any)._updateFormData).toHaveBeenCalled();
    });

    it('should call _updateFormData for plain object', () => {
      component.setData({ name: 'Bob' });
      expect((component as any)._updateFormData).toHaveBeenCalled();
      expect((component as any)._emitData).toHaveBeenCalledWith({ name: 'Bob' });
    });

    it('should call _updateFormData with empty object for unsupported type', () => {
      component.setData('unsupported');
      expect((component as any)._updateFormData).toHaveBeenCalledWith({});
    });
  });

  // ─── validateBeforeAction() ──────────────────────────────────────────────────

  describe('Method: validateBeforeAction()', () => {
    it('should return true when formDataValidationFunction is not set', () => {
      component.formDataValidationFunction = undefined;
      expect(component.validateBeforeAction({ field: 'value' })).toBe(true);
    });

    it('should return true when validation function returns valid', () => {
      component.formDataValidationFunction = () => ({ valid: true });
      expect(component.validateBeforeAction({ field: 'value' })).toBe(true);
    });

    it('should return false and show dialog when validation fails', () => {
      const mockDialog = jasmine.createSpyObj('dialogService', ['alert']);
      (component as any).dialogService = mockDialog;
      const mockMsgService = { getValidationErrorDialogTitle: () => 'Error', getValidationError: () => 'Invalid' };
      (component as any)._messageService = mockMsgService;
      component.formDataValidationFunction = () => ({ valid: false });
      expect(component.validateBeforeAction({ field: 'bad' })).toBe(false);
      expect(mockDialog.alert).toHaveBeenCalled();
    });
  });

  // ─── executeToolbarAction() ──────────────────────────────────────────────────

  describe('Method: executeToolbarAction()', () => {
    it('should call back() for BACK_ACTION', () => {
      spyOn(component, 'back');
      component.executeToolbarAction(Codes.BACK_ACTION);
      expect(component.back).toHaveBeenCalled();
    });

    it('should call closeDetail() for CLOSE_DETAIL_ACTION', () => {
      spyOn(component, 'closeDetail');
      component.executeToolbarAction(Codes.CLOSE_DETAIL_ACTION);
      expect(component.closeDetail).toHaveBeenCalled();
    });

    it('should call reload() for RELOAD_ACTION', () => {
      spyOn(component, 'reload');
      component.executeToolbarAction(Codes.RELOAD_ACTION);
      expect(component.reload).toHaveBeenCalledWith(true);
    });

    it('should call goInsertMode() for GO_INSERT_ACTION', () => {
      spyOn(component, 'goInsertMode');
      component.executeToolbarAction(Codes.GO_INSERT_ACTION);
      expect(component.goInsertMode).toHaveBeenCalled();
    });

    it('should call undo() for UNDO_LAST_CHANGE_ACTION', () => {
      spyOn(component, 'undo');
      component.executeToolbarAction(Codes.UNDO_LAST_CHANGE_ACTION);
      expect(component.undo).toHaveBeenCalled();
    });

    it('should return undefined for unknown action', () => {
      expect(component.executeToolbarAction('UNKNOWN_ACTION')).toBeUndefined();
    });
  });

  // ─── hasDeactivateGuard() ────────────────────────────────────────────────────

  describe('Method: hasDeactivateGuard()', () => {
    it('should return false when deactivateGuard is undefined', () => {
      (component as any).deactivateGuard = undefined;
      expect(component.hasDeactivateGuard()).toBe(false);
    });

    it('should return true when deactivateGuard is defined', () => {
      (component as any).deactivateGuard = {} as any;
      expect(component.hasDeactivateGuard()).toBe(true);
    });
  });

  // ─── canDeactivate() ─────────────────────────────────────────────────────────

  describe('Method: canDeactivate()', () => {
    it('should return true in read-only initial mode without editable detail', () => {
      component.mode = OFormComponent.Mode().INITIAL;
      (component as any).editableDetail = false;
      expect(component.canDeactivate()).toBe(true);
    });

    it('should return true when confirmExit is false', () => {
      component.mode = OFormComponent.Mode().INSERT;
      component.confirmExit = false;
      expect(component.canDeactivate()).toBe(true);
    });

    it('should return true when canDiscardChanges is true', () => {
      component.mode = OFormComponent.Mode().INSERT;
      component.confirmExit = true;
      component.canDiscardChanges = true;
      expect(component.canDeactivate()).toBe(true);
    });
  });

  // ─── isCacheStackEmpty ───────────────────────────────────────────────────────

  describe('Property: isCacheStackEmpty', () => {
    it('should delegate to formCache.isCacheStackEmpty', () => {
      const mockCache = { isCacheStackEmpty: true };
      (component as any).formCache = mockCache;
      expect(component.isCacheStackEmpty).toBe(true);
    });

    it('should return false when cache has items', () => {
      const mockCache = { isCacheStackEmpty: false };
      (component as any).formCache = mockCache;
      expect(component.isCacheStackEmpty).toBe(false);
    });
  });

  // ─── getRequiredComponents() ─────────────────────────────────────────────────

  describe('Method: getRequiredComponents()', () => {
    it('should return components marked as required', () => {
      (component as any)._components = {
        name: { getAttribute: () => 'name', isRequired: true } as any,
        age: { getAttribute: () => 'age', isRequired: false } as any
      };
      const req = component.getRequiredComponents();
      expect(req['name']).toBeDefined();
      expect(req['age']).toBeUndefined();
    });

    it('should return empty object when no required components', () => {
      (component as any)._components = {};
      expect(component.getRequiredComponents()).toEqual({});
    });
  });

  // ─── getAttributesToQuery() ──────────────────────────────────────────────────

  describe('Method: getAttributesToQuery()', () => {
    it('should include keys from keysArray', () => {
      component.keysArray = ['id', 'code'];
      (component as any)._components = {};
      const attrs = component.getAttributesToQuery();
      expect(attrs).toContain('id');
      expect(attrs).toContain('code');
    });

    it('should include attributes from colsArray not otherwise included', () => {
      component.keysArray = [];
      component.colsArray = ['extraCol'];
      (component as any)._components = {};
      const attrs = component.getAttributesToQuery();
      expect(attrs).toContain('extraCol');
    });
  });
});
