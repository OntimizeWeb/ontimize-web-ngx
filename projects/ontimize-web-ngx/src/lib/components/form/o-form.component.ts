import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Injector,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';

import { InputConverter } from '../../decorators/input-converter';
import { IComponent } from '../../interfaces/component.interface';
import { IFormDataComponent } from '../../interfaces/form-data-component.interface';
import { IFormDataTypeComponent } from '../../interfaces/form-data-type-component.interface';
import { ServiceResponse } from '../../interfaces/service-response.interface';
import { OFormLayoutManagerComponent } from '../../layouts/form-layout/o-form-layout-manager.component';
import { DialogService } from '../../services/dialog.service';
import { OntimizeServiceProvider } from '../../services/factories';
import { NavigationService, ONavigationItem } from '../../services/navigation.service';
import { OntimizeService } from '../../services/ontimize/ontimize.service';
import { PermissionsService } from '../../services/permissions/permissions.service';
import { SnackBarService } from '../../services/snackbar.service';
import { FormValueOptions } from '../../types/form-value-options.type';
import { OFormInitializationOptions } from '../../types/o-form-initialization-options.type';
import { OFormPermissions } from '../../types/o-form-permissions.type';
import { OPermissions } from '../../types/o-permissions.type';
import { Codes } from '../../util/codes';
import { SQLTypes } from '../../util/sqltypes';
import { Util } from '../../util/util';
import { OFormContainerComponent } from '../form-container/o-form-container.component';
import { OFormControl } from '../input/o-form-control.class';
import { OFormCacheClass } from './cache/o-form.cache.class';
import { CanComponentDeactivate, CanDeactivateFormGuard } from './guards/o-form-can-deactivate.guard';
import { OFormNavigationClass } from './navigation/o-form.navigation.class';
import { OFormValue } from './OFormValue';
import { OFormToolbarComponent } from './toolbar/o-form-toolbar.component';

interface IFormDataComponentHash {
  [attr: string]: IFormDataComponent;
}

export const DEFAULT_INPUTS_O_FORM = [
  // show-header [boolean]: visibility of form toolbar. Default: yes.
  'showHeader: show-header',

  // header-mode [string][ none | floating ]: painting mode of form toolbar. Default: 'floating'
  'headerMode: header-mode',

  // header-position [ top | bottom ]: position of the form toolbar. Default: 'top'
  'headerPosition: header-position',

  // label-header [string]: displayable text on form toolbar. Default: ''.
  'labelheader: label-header',

  // label-header-align [string][start | center | end]: alignment of form toolbar text. Default: 'center'
  'labelHeaderAlign: label-header-align',

  // header-actions [string]: available action buttons on form toolbar of standard CRUD operations, separated by ';'. Available options are R;I;U;D (Refresh, Insert, Update, Delete). Default: R;I;U;D
  'headeractions: header-actions',

  // show-header-actions-text [string][yes|no|true|false]: show text of form toolbar buttons. Default yes
  'showHeaderActionsText: show-header-actions-text',

  // entity [string]: entity of the service. Default: no value.
  'entity',

  // keys [string]: entity keys, separated by ';'. Default: no value.
  'keys',

  // columns [string]: columns of the entity, separated by ';'. Default: no value.
  'columns',

  // service [string]: JEE service path. Default: no value.
  'service',

  // stay-in-record-after-edit [string][yes|no|true|false]: shows edit form after edit a record. Default: false;
  'stayInRecordAfterEdit: stay-in-record-after-edit',

  // [string][new | detail]: shows reseted form after insert a new record (new) or shows the inserted record after (detail)
  'afterInsertMode: after-insert-mode',

  'serviceType : service-type',

  'queryOnInit : query-on-init',

  'parentKeys: parent-keys',

  // query-method [string]: name of the service method to perform queries. Default: query.
  'queryMethod: query-method',

  // insert-method [string]: name of the service method to perform inserts. Default: insert.
  'insertMethod: insert-method',

  // update-method [string]: name of the service method to perform updates. Default: update.
  'updateMethod: update-method',

  // delete-method [string]: name of the service method to perform deletions. Default: delete.
  'deleteMethod: delete-method',

  // layout-direction [string][column|row]: Default: column
  'layoutDirection: layout-direction',

  // fxLayoutAlign value. Default: 'start start'
  'layoutAlign: layout-align',

  // editable-detail [string][yes|no|true|false]: Default: true;
  'editableDetail: editable-detail',

  // keys-sql-types [string]: entity keys types, separated by ';'. Default: no value.
  'keysSqlTypes: keys-sql-types',

  // undo-button [string][yes|no|true|false]: Include undo button in form-toolbar. Default: true;
  'undoButton: undo-button',

  // show-header-navigation [string][yes|no|true|false]: Include navigations buttons in form-toolbar. Default: false;
  'showHeaderNavigation: show-header-navigation',

  // attr
  'oattr:attr',

  'includeBreadcrumb: include-breadcrumb',

  'detectChangesOnBlur: detect-changes-on-blur',

  'confirmExit: confirm-exit',

  // [function]: function to execute on query error. Default: no value.
  'queryFallbackFunction: query-fallback-function'
  // ,

  // 'insertFallbackFunction: insert-fallback-function',

  // 'updateFallbackFunction: update-fallback-function',

  // 'deleteFallbackFunction: delete-fallback-function'
];

export const DEFAULT_OUTPUTS_O_FORM = [
  'onDataLoaded',
  'beforeCloseDetail',
  'beforeGoEditMode',
  'onFormModeChange',
  'onInsert',
  'onUpdate',
  'onDelete'
];
@Component({
  selector: 'o-form',
  providers: [
    OntimizeServiceProvider
  ],
  templateUrl: './o-form.component.html',
  styleUrls: ['./o-form.component.scss'],
  inputs: DEFAULT_INPUTS_O_FORM,
  outputs: DEFAULT_OUTPUTS_O_FORM,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-form]': 'true'
  }
})
export class OFormComponent implements OnInit, OnDestroy, CanComponentDeactivate, AfterViewInit {

  public static DEFAULT_LAYOUT_DIRECTION = 'column';
  public static guardClassName = 'CanDeactivateFormGuard';

  /* inputs variables */
  @InputConverter()
  showHeader: boolean = true;
  headerMode: string = 'floating';
  headerPosition: 'top' | 'bottom' = 'top';
  labelheader: string = '';
  labelHeaderAlign: string = 'center';
  headeractions: string = '';
  showHeaderActionsText: string = 'yes';
  entity: string;
  keys: string = '';
  columns: string = '';
  service: string;
  @InputConverter()
  stayInRecordAfterEdit: boolean = false;
  afterInsertMode: 'new' | 'detail' = null;
  serviceType: string;
  @InputConverter()
  protected queryOnInit: boolean = true;
  protected parentKeys: string;
  protected queryMethod: string = Codes.QUERY_METHOD;
  protected insertMethod: string = Codes.INSERT_METHOD;
  protected updateMethod: string = Codes.UPDATE_METHOD;
  protected deleteMethod: string = Codes.DELETE_METHOD;
  protected _layoutDirection: string = OFormComponent.DEFAULT_LAYOUT_DIRECTION;
  protected _layoutAlign: string = 'start start';
  @InputConverter()
  protected editableDetail: boolean = true;
  protected keysSqlTypes: string;
  @InputConverter()
  undoButton: boolean = true;
  @InputConverter()
  showHeaderNavigation: boolean = false;
  public oattr: string = '';
  @InputConverter()
  includeBreadcrumb: boolean = false;
  @InputConverter()
  detectChangesOnBlur: boolean = true;
  @InputConverter()
  confirmExit: boolean = true;
  public queryFallbackFunction: (error: any) => void;
  // public insertFallbackFunction: Function;
  // public updateFallbackFunction: Function;
  // public deleteFallbackFunction: Function;

  /* end of inputs variables */

  /*parsed inputs variables */
  isDetailForm: boolean = false;
  keysArray: string[] = [];
  colsArray: string[] = [];
  dataService: any;
  _pKeysEquiv = {};
  keysSqlTypesArray: Array<string> = [];
  /* end of parsed inputs variables */

  formGroup: FormGroup;
  onDataLoaded: EventEmitter<object> = new EventEmitter<object>();
  beforeCloseDetail: EventEmitter<any> = new EventEmitter<any>();
  beforeGoEditMode: EventEmitter<any> = new EventEmitter<any>();
  onFormModeChange: EventEmitter<number> = new EventEmitter<number>();
  public onInsert: EventEmitter<any> = new EventEmitter();
  public onUpdate: EventEmitter<any> = new EventEmitter();
  public onDelete: EventEmitter<any> = new EventEmitter();

  protected loadingSubject = new BehaviorSubject<boolean>(false);
  public loading: Observable<boolean> = this.loadingSubject.asObservable();
  public formData: object = {};
  public navigationData: Array<any> = [];
  public currentIndex = 0;
  public mode: number = OFormComponent.Mode().INITIAL;

  protected dialogService: DialogService;
  protected navigationService: NavigationService;
  protected snackBarService: SnackBarService;

  protected _formToolbar: OFormToolbarComponent;

  protected _components: IFormDataComponentHash = {};
  protected _compSQLTypes: object = {};

  formParentKeysValues: object;

  public onFormInitStream: EventEmitter<boolean> = new EventEmitter<boolean>();
  protected reloadStream: Observable<any>;
  protected reloadStreamSubscription: Subscription;

  protected querySubscription: Subscription;
  protected loaderSubscription: Subscription;
  protected dynamicFormSubscription: Subscription;

  protected deactivateGuard: CanDeactivateFormGuard;
  protected formCache: OFormCacheClass;
  protected formNavigation: OFormNavigationClass;

  public formContainer: OFormContainerComponent;

  protected permissionsService: PermissionsService;
  protected permissions: OFormPermissions;

  @ViewChild('innerForm', { static: false }) innerFormEl: ElementRef;

  ignoreFormCacheKeys: Array<any> = [];
  canDiscardChanges: boolean;

  public static Mode(): any {
    enum m {
      QUERY,
      INSERT,
      UPDATE,
      INITIAL
    }
    return m;
  }

  constructor(
    protected router: Router,
    protected actRoute: ActivatedRoute,
    protected zone: NgZone,
    protected cd: ChangeDetectorRef,
    protected injector: Injector,
    protected elRef: ElementRef
  ) {

    this.formCache = new OFormCacheClass(this);
    this.formNavigation = new OFormNavigationClass(this.injector, this, this.router, this.actRoute);

    this.dialogService = injector.get(DialogService);
    this.navigationService = injector.get(NavigationService);
    this.snackBarService = injector.get(SnackBarService);
    this.permissionsService = this.injector.get(PermissionsService);

    const self = this;
    this.reloadStream = combineLatest([
      self.onFormInitStream.asObservable(),
      self.formNavigation.navigationStream.asObservable()
    ]);

    this.reloadStreamSubscription = this.reloadStream.subscribe(valArr => {
      if (Util.isArray(valArr) && valArr.length === 2 && !self.isInInsertMode()) {
        const valArrValues = valArr[0] === true && valArr[1] === true;
        if (self.queryOnInit && valArrValues) {
          self._reloadAction(true);
        } else {
          self.initializeFields();
        }
      }
    });

    try {
      this.formContainer = injector.get(OFormContainerComponent);
      this.formContainer.setForm(this);
    } catch (e) {
      //
    }
  }

  registerFormComponent(comp: any) {
    if (comp) {
      const attr = comp.getAttribute();
      if (attr && attr.length > 0) {

        if (!comp.isAutomaticRegistering()) {
          return;
        }

        if (this._components.hasOwnProperty(attr)) {
          comp.repeatedAttr = true;
          console.error('There is already a component registered in the form with the attr: ' + attr);
          return;
        }

        this._components[attr] = comp;
        // Setting parent key values...
        if (this.formParentKeysValues && this.formParentKeysValues[attr] !== undefined) {
          const val = this.formParentKeysValues[attr];
          this._components[attr].setValue(val, {
            emitModelToViewChange: false,
            emitEvent: false
          });
        }
        /*
        * TODO. Check it!!!
        * En un formulario con tabs, cuando se cambia de uno a otro, se destruyen las vistas
        * de los componentes hijo del formulario.
        * formDataCache contiene los valores (originales ó editados) de los campos del formulario.
        * La idea es asignar ese valor al campo cuando se registre de nuevo (Hay que asegurar el proceso
        * para que sólo sea cuando se registra de nuevo ;) )
        */
        const cachedValue = this.formCache.getCachedValue(attr);
        if (Util.isDefined(cachedValue) && this.getDataValues() && this._components.hasOwnProperty(attr)) {
          this._components[attr].setValue(cachedValue, {
            emitModelToViewChange: false,
            emitEvent: false
          });
        }
      }
    }
  }

  registerSQLTypeFormComponent(comp: IFormDataTypeComponent) {
    if ((comp as any).repeatedAttr) {
      return;
    }
    if (comp) {
      const type = comp.getSQLType();
      const attr = comp.getAttribute();
      if (type !== SQLTypes.OTHER && attr && attr.length > 0 && this.ignoreFormCacheKeys.indexOf(attr) === -1) {
        // Right now just store values different of 'OTHER'
        this._compSQLTypes[attr] = type;
      }
    }
  }

  registerFormControlComponent(comp: IFormDataComponent) {
    if ((comp as any).repeatedAttr) {
      return;
    }
    if (comp) {
      const attr = comp.getAttribute();
      if (attr && attr.length > 0) {
        const control: FormControl = comp.getControl();
        if (control) {
          this.formGroup.registerControl(attr, control);
          if (!comp.isAutomaticRegistering()) {
            this.ignoreFormCacheKeys.push(comp.getAttribute());
          }
        }
      }
    }
  }

  unregisterFormComponent(comp: IComponent) {
    if (comp) {
      const attr = comp.getAttribute();
      if (attr && attr.length > 0 && this._components.hasOwnProperty(attr)) {
        delete this._components[attr];
      }
    }
  }

  unregisterFormControlComponent(comp: IFormDataComponent) {
    if (comp && comp.isAutomaticRegistering()) {
      const control: FormControl = comp.getControl();
      const attr = comp.getAttribute();
      if (control && attr && attr.length > 0) {
        this.formGroup.removeControl(attr);
      }
    }
  }

  unregisterSQLTypeFormComponent(comp: IFormDataTypeComponent) {
    if (comp) {
      const attr = comp.getAttribute();
      if (attr && attr.length > 0) {
        delete this._compSQLTypes[attr];
      }
    }
  }

  registerToolbar(fToolbar: OFormToolbarComponent) {
    if (fToolbar) {
      this._formToolbar = fToolbar;
      this._formToolbar.isDetail = this.isDetailForm;
    }
  }

  getComponents(): IFormDataComponentHash {
    return this._components;
  }

  public load(): any {
    const self = this;
    const zone = this.injector.get(NgZone);
    const loadObservable = new Observable(observer => {
      const timer = window.setTimeout(() => {
        observer.next(true);
      }, 250);

      return () => {
        window.clearTimeout(timer);
        zone.run(() => {
          self.loadingSubject.next(false);
        });
      };

    });
    const subscription = loadObservable.subscribe(val => {
      zone.run(() => {
        self.loadingSubject.next(val as boolean);
      });
    });
    return subscription;
  }

  getDataValue(attr: string) {
    if (this.isInInsertMode()) {
      const urlParams = this.formNavigation.getFilterFromUrlParams();
      const val = this.formGroup.value[attr] || urlParams[attr];
      return new OFormValue(val);
    } else if (this.isInInitialMode() && !this.isEditableDetail()) {
      const data = this.formData;
      if (data && data.hasOwnProperty(attr)) {
        return data[attr];
      }
    } else if (this.isInUpdateMode() || this.isEditableDetail()) {
      if (this.formData && Object.keys(this.formData).length > 0) {
        const val = this.formCache.getCachedValue(attr);
        if (this.formGroup.dirty && val) {
          if (val instanceof OFormValue) {
            return val;
          }
          return new OFormValue(val);
        } else {
          // Return original value stored into form data...
          const data = this.formData;
          if (data && data.hasOwnProperty(attr)) {
            return data[attr];
          }
        }
      }
    }
    return new OFormValue();
  }

  getDataValues() {
    return this.formData;
  }

  clearData() {
    const filter = this.formNavigation.getFilterFromUrlParams();
    this.formGroup.reset({}, {
      emitEvent: false
    });
    this._setData(filter);
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.confirmExit) {
      return true;
    }
    const canDiscardChanges = this.canDiscardChanges;
    this.canDiscardChanges = false;
    return canDiscardChanges || this.showConfirmDiscardChanges();
  }

  showConfirmDiscardChanges(): Promise<boolean> {
    return this.formNavigation.showConfirmDiscardChanges();
  }

  executeToolbarAction(action: string, options?: any) {
    switch (action) {
      case Codes.BACK_ACTION: this._backAction(); break;
      case Codes.CLOSE_DETAIL_ACTION: this._closeDetailAction(options); break;
      case Codes.RELOAD_ACTION: this._reloadAction(true); break;
      case Codes.GO_INSERT_ACTION: this._goInsertMode(options); break;
      case Codes.INSERT_ACTION: this._insertAction(); break;
      case Codes.GO_EDIT_ACTION: this._goEditMode(options); break;
      case Codes.EDIT_ACTION: this._editAction(); break;
      case Codes.UNDO_LAST_CHANGE_ACTION: this._undoLastChangeAction(); break;
      case Codes.DELETE_ACTION: return this._deleteAction();
      default: break;
    }
    return undefined;
  }

  ngOnInit(): void {
    this.addDeactivateGuard();

    this.formGroup = new FormGroup({});

    this.formNavigation.initialize();

    this.initialize();
  }

  addDeactivateGuard() {
    if (this.isInInitialMode() && !this.isEditableDetail()) {
      return;
    }
    if (!this.actRoute || !this.actRoute.routeConfig) {
      return;
    }
    this.deactivateGuard = this.injector.get(CanDeactivateFormGuard);
    this.deactivateGuard.setForm(this);
    const canDeactivateArray = (this.actRoute.routeConfig.canDeactivate || []);
    let previouslyAdded = false;
    for (let i = 0, len = canDeactivateArray.length; i < len; i++) {
      previouslyAdded = ((canDeactivateArray[i].hasOwnProperty('CLASSNAME') && canDeactivateArray[i].CLASSNAME) === OFormComponent.guardClassName);
      if (previouslyAdded) {
        break;
      }
    }
    if (!previouslyAdded) {
      canDeactivateArray.push(this.deactivateGuard.constructor);
      this.actRoute.routeConfig.canDeactivate = canDeactivateArray;
    }
  }

  destroyDeactivateGuard() {
    try {
      if (!this.deactivateGuard || !this.actRoute || !this.actRoute.routeConfig || !this.actRoute.routeConfig.canDeactivate) {
        return;
      }
      this.deactivateGuard.setForm(undefined);
      for (let i = this.actRoute.routeConfig.canDeactivate.length - 1; i >= 0; i--) {
        if (this.actRoute.routeConfig.canDeactivate[i].name === OFormComponent.guardClassName) {
          this.actRoute.routeConfig.canDeactivate.splice(i, 1);
          break;
        }
      }
      if (this.actRoute.routeConfig.canDeactivate.length === 0) {
        delete this.actRoute.routeConfig.canDeactivate;
      }
    } catch (e) {
      //
    }
  }

  hasDeactivateGuard() {
    return Util.isDefined(this.deactivateGuard);
  }

  /**
   * Angular methods
   */

  initialize() {
    const self = this;
    if (this.headeractions === 'all') {
      this.headeractions = 'R;I;U;D';
    }
    this.keysArray = Util.parseArray(this.keys, true);
    this.colsArray = Util.parseArray(this.columns, true);
    const pkArray = Util.parseArray(this.parentKeys);
    this._pKeysEquiv = Util.parseParentKeysEquivalences(pkArray);
    this.keysSqlTypesArray = Util.parseArray(this.keysSqlTypes);

    this.configureService();

    this.formNavigation.subscribeToQueryParams();
    this.formNavigation.subscribeToUrlParams();
    this.formNavigation.subscribeToUrl();
    this.formNavigation.subscribeToCacheChanges(this.formCache.onCacheEmptyStateChanges);

    if (this.navigationService) {
      this.navigationService.onVisibleChange(visible => {
        self.showHeader = visible;
      });
    }

    this.mode = OFormComponent.Mode().INITIAL;

    this.permissions = this.permissionsService.getFormPermissions(this.oattr, this.actRoute);

    if (typeof this.queryFallbackFunction !== 'function') {
      this.queryFallbackFunction = undefined;
    }
    // if (typeof this.insertFallbackFunction !== 'function') {
    //   this.insertFallbackFunction = undefined;
    // }
    // if (typeof this.updateFallbackFunction !== 'function') {
    //   this.updateFallbackFunction = undefined;
    // }
    // if (typeof this.deleteFallbackFunction !== 'function') {
    //   this.deleteFallbackFunction = undefined;
    // }
  }

  reinitialize(options: OFormInitializationOptions) {
    if (options && Object.keys(options).length) {
      const clonedOpts = Object.assign({}, options);
      for (const prop in clonedOpts) {
        if (clonedOpts.hasOwnProperty(prop)) {
          this[prop] = clonedOpts[prop];
        }
      }
      this.destroy();
      this.initialize();
    }
  }

  configureService() {
    let loadingService: any = OntimizeService;
    if (this.serviceType) {
      loadingService = this.serviceType;
    }
    try {
      this.dataService = this.injector.get(loadingService);
      if (Util.isDataService(this.dataService)) {
        const serviceCfg = this.dataService.getDefaultServiceConfiguration(this.service);
        if (this.entity) {
          serviceCfg.entity = this.entity;
        }
        this.dataService.configureService(serviceCfg);
      }
    } catch (e) {
      console.error(e);
    }
  }

  ngOnDestroy() {
    this.destroy();
  }

  destroy() {
    if (this.reloadStreamSubscription) {
      this.reloadStreamSubscription.unsubscribe();
    }
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
    if (this.loaderSubscription) {
      this.loaderSubscription.unsubscribe();
    }
    this.formCache.destroy();
    this.formNavigation.destroy();
    this.destroyDeactivateGuard();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.determinateFormMode();
      this.onFormInitStream.emit(true);
    }, 0);
  }

  /*
   * Inner methods
   */

  _setComponentsEditable(state: boolean) {
    const components: any = this.getComponents();
    Object.keys(components).forEach(compKey => {
      const component = components[compKey];
      component.isReadOnly = !state;
    });
  }

  /**
   * Sets form operation mode.
   * @param mode The mode to be established
   */
  setFormMode(mode: number) {
    switch (mode) {
      case OFormComponent.Mode().INITIAL:
        this.mode = mode;
        if (this._formToolbar) {
          this._formToolbar.setInitialMode();
        }
        this._setComponentsEditable(this.isEditableDetail());
        this.onFormModeChange.emit(this.mode);
        break;
      case OFormComponent.Mode().INSERT:
        this.mode = mode;
        if (this._formToolbar) {
          this._formToolbar.setInsertMode();
        }
        this.clearData();
        this._setComponentsEditable(true);
        this.onFormModeChange.emit(this.mode);
        break;
      case OFormComponent.Mode().UPDATE:
        this.mode = mode;
        if (this._formToolbar) {
          this._formToolbar.setEditMode();
        }
        this._setComponentsEditable(true);
        this.onFormModeChange.emit(this.mode);
        break;
      default:
        break;
    }
  }

  _setData(data) {
    if (Util.isArray(data)) {
      if (data.length > 1) {
        console.warn('[OFormComponent] Form data has more than a single record. Storing empty data');
      }
      const currentData = data.length === 1 ? data[0] : {};
      this._updateFormData(this.toFormValueData(currentData));
      this._emitData(currentData);
    } else if (Util.isObject(data)) {
      this._updateFormData(this.toFormValueData(data));
      this._emitData(data);
    } else {
      console.warn('Form has received not supported service data. Supported data are Array or Object');
      this._updateFormData({});
    }
  }

  _emitData(data) {
    this.onDataLoaded.emit(data);
  }

  _backAction() {
    this.formNavigation.navigateBack();
  }

  _closeDetailAction(options?: any) {
    this.formNavigation.closeDetailAction(options);
  }

  _stayInRecordAfterInsert(insertedKeys: object) {
    this.formNavigation.stayInRecordAfterInsert(insertedKeys);
  }

  _reloadAction(useFilter: boolean = false) {
    let filter = {};
    if (useFilter) {
      filter = this.getCurrentKeysValues();
    }
    this.queryData(filter);
  }

  /**
   * Navigates to 'insert' mode
   */
  _goInsertMode(options?: any) {
    this.formNavigation.goInsertMode(options);
  }

  _clearFormAfterInsert() {
    this.clearData();
    this._setComponentsEditable(true);
  }

  /**
   * Performs insert action.
   */
  _insertAction() {
    Object.keys(this.formGroup.controls).forEach((control) => {
      this.formGroup.controls[control].markAsTouched();
    });

    if (!this.formGroup.valid) {
      this.dialogService.alert('ERROR', 'MESSAGES.FORM_VALIDATION_ERROR');
      return;
    }

    const self = this;
    const values = this.getAttributesValuesToInsert();
    const sqlTypes = this.getAttributesSQLTypes();
    this.insertData(values, sqlTypes).subscribe(resp => {
      self.postCorrectInsert(resp);
      self.formCache.setCacheSnapshot();
      self.markFormLayoutManagerToUpdate();
      if (self.afterInsertMode === 'detail') {
        self._stayInRecordAfterInsert(resp);
      } else if (self.afterInsertMode === 'new') {
        this._clearFormAfterInsert();
      } else {
        self._closeDetailAction();
      }
    }, error => {
      self.postIncorrectInsert(error);
    });
  }

  /**
   * Navigates to 'edit' mode
   */
  _goEditMode(options?: any) {
    this.formNavigation.goEditMode();
  }

  /**
   * Performs 'edit' action
   */
  _editAction() {
    Object.keys(this.formGroup.controls).forEach(
      (control) => {
        this.formGroup.controls[control].markAsTouched();
      }
    );

    if (!this.formGroup.valid) {
      this.dialogService.alert('ERROR', 'MESSAGES.FORM_VALIDATION_ERROR');
      return;
    }

    // retrieving keys...
    const self = this;
    const filter = this.getKeysValues();

    // retrieving values to update...
    const values = this.getAttributesValuesToUpdate();
    const sqlTypes = this.getAttributesSQLTypes();

    if (Object.keys(values).length === 0) {
      // Nothing to update
      this.dialogService.alert('INFO', 'MESSAGES.FORM_NOTHING_TO_UPDATE_INFO');
      return;
    }

    // invoke update method...
    this.updateData(filter, values, sqlTypes).subscribe(resp => {
      self.postCorrectUpdate(resp);
      self.formCache.setCacheSnapshot();
      self.markFormLayoutManagerToUpdate();
      if (self.stayInRecordAfterEdit) {
        self._reloadAction(true);
      } else {
        self._closeDetailAction();
      }
    }, error => {
      self.postIncorrectUpdate(error);
    });
  }

  /**
   * Performs 'delete' action
   */
  _deleteAction() {
    const filter = this.getKeysValues();
    return this.deleteData(filter);
  }

  /*
  Utility methods
  */

  queryData(filter) {
    if (!Util.isDefined(this.dataService)) {
      console.warn('OFormComponent: no service configured! aborting query');
      return;
    }
    if (!Util.isDefined(filter) || Object.keys(filter).length === 0) {
      console.warn('OFormComponent: no filter configured! aborting query');
      return;
    }
    this.formCache.restartCache();
    this.clearComponentsOldValue();
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
    if (this.loaderSubscription) {
      this.loaderSubscription.unsubscribe();
    }
    this.loaderSubscription = this.load();
    const av = this.getAttributesToQuery();
    const sqlTypes = this.getAttributesSQLTypes();
    this.querySubscription = this.dataService[this.queryMethod](filter, av, this.entity, sqlTypes)
      .subscribe((resp: ServiceResponse) => {
        if (resp.isSuccessful()) {
          this._setData(resp.data);
        } else {
          this._updateFormData({});
          this.dialogService.alert('ERROR', 'MESSAGES.ERROR_QUERY');
          console.error('ERROR: ' + resp.message);
        }
        this.loaderSubscription.unsubscribe();
      }, err => {
        console.error(err);
        this._updateFormData({});
        if (Util.isDefined(this.queryFallbackFunction)) {
          this.queryFallbackFunction(err);
        } else if (err && err.statusText) {
          this.dialogService.alert('ERROR', err.statusText);
        } else {
          this.dialogService.alert('ERROR', 'MESSAGES.ERROR_QUERY');
        }
        this.loaderSubscription.unsubscribe();
      });
  }

  getAttributesToQuery(): Array<any> {
    let attributes: Array<any> = [];
    // add form keys...
    if (this.keysArray && this.keysArray.length > 0) {
      attributes.push(...this.keysArray);
    }
    const components: any = this.getComponents();
    // add only the fields contained into the form...
    Object.keys(components).forEach(item => {
      if (attributes.indexOf(item) < 0 &&
        components[item].isAutomaticRegistering() && components[item].isAutomaticBinding()) {
        attributes.push(item);
      }
    });

    // add fields stored into form cache...
    const dataCache = this.formCache.getDataCache();
    if (dataCache) {
      Object.keys(dataCache).forEach(item => {
        if (item !== undefined && attributes.indexOf(item) === -1) {
          attributes.push(item);
        }
      });
    }
    attributes = attributes.concat(this.colsArray.filter(col => attributes.indexOf(col) < 0));
    return attributes;
  }

  insertData(values, sqlTypes?: object): Observable<any> {
    if (this.loaderSubscription) {
      this.loaderSubscription.unsubscribe();
    }
    this.loaderSubscription = this.load();
    const self = this;
    const observable = new Observable(observer => {
      this.dataService[this.insertMethod](values, this.entity, sqlTypes).subscribe(
        resp => {
          if (resp.isSuccessful()) {
            observer.next(resp.data);
            observer.complete();
          } else {
            observer.error(resp.message);
          }
          self.loaderSubscription.unsubscribe();
        },
        err => {
          observer.error(err);
          self.loaderSubscription.unsubscribe();
        });
    });
    return observable;
  }

  getAttributesValuesToInsert(): object {
    const attrValues = {};
    if (this.formParentKeysValues) {
      Object.assign(attrValues, this.formParentKeysValues);
    }
    return Object.assign(attrValues, this.getRegisteredFieldsValues());
  }

  /**
   * Returns an object with the sql types from the form components and the form keys
   */
  public getAttributesSQLTypes(): object {
    const types: object = {};
    // Add form keys sql types
    this.keysSqlTypesArray.forEach((kst, i) => types[this.keysArray[i]] = SQLTypes.getSQLTypeValue(kst));
    // Add form components sql types
    if (this._compSQLTypes && Object.keys(this._compSQLTypes).length > 0) {
      Object.assign(types, this._compSQLTypes);
    }
    return types;
  }

  updateData(filter, values, sqlTypes?: object): Observable<any> {
    if (this.loaderSubscription) {
      this.loaderSubscription.unsubscribe();
    }
    this.loaderSubscription = this.load();
    const self = this;
    const observable = new Observable(observer => {
      this.dataService[this.updateMethod](filter, values, this.entity, sqlTypes).subscribe(
        resp => {
          if (resp.isSuccessful()) {
            observer.next(resp.data);
            observer.complete();
          } else {
            observer.error(resp.message);
          }
          self.loaderSubscription.unsubscribe();
        },
        err => {
          observer.error(err);
          self.loaderSubscription.unsubscribe();
        });
    });
    return observable;
  }

  getAttributesValuesToUpdate(): object {
    const values = {};
    const self = this;
    const changedAttrs = this.formCache.getChangedFormControlsAttr();
    Object.keys(this.formGroup.controls).filter(controlName =>
      self.ignoreFormCacheKeys.indexOf(controlName) === -1 &&
      changedAttrs.indexOf(controlName) !== -1
    ).forEach((item) => {
      const control = self.formGroup.controls[item];
      if (control instanceof OFormControl) {
        values[item] = control.getValue();
      } else {
        values[item] = control.value;
      }
      if (values[item] === undefined) {
        values[item] = null;
      }
    });
    return values;
  }

  deleteData(filter): Observable<any> {
    if (this.loaderSubscription) {
      this.loaderSubscription.unsubscribe();
    }
    this.loaderSubscription = this.load();
    const self = this;
    const observable = new Observable(observer => {
      this.canDiscardChanges = true;
      this.dataService[this.deleteMethod](filter, this.entity).subscribe(
        resp => {
          if (resp.isSuccessful()) {
            self.formCache.setCacheSnapshot();
            self.markFormLayoutManagerToUpdate();
            self.postCorrectDelete(resp);
            observer.next(resp.data);
            observer.complete();
          } else {
            self.postIncorrectDelete(resp);
            observer.error(resp.message);
          }
          self.loaderSubscription.unsubscribe();
        },
        err => {
          self.postIncorrectDelete(err);
          observer.error(err);
          self.loaderSubscription.unsubscribe();
        });
    });
    return observable;
  }

  toJSONData(data) {
    if (!data) {
      data = {};
    }
    const valueData = {};
    Object.keys(data).forEach((item) => {
      valueData[item] = data[item].value;
    });
    return valueData;
  }

  toFormValueData(data) {
    if (data && Util.isArray(data)) {
      const valueData: Array<object> = [];
      const self = this;
      data.forEach(item => {
        valueData.push(self.objectToFormValueData(item));
      });
      return valueData;
    } else if (data && Util.isObject(data)) {
      return this.objectToFormValueData(data);
    }
    return undefined;
  }

  getKeysValues() {
    const filter = {};
    const currentRecord = this.formData;
    if (!this.keysArray) {
      return filter;
    }
    this.keysArray.forEach(key => {
      if (currentRecord[key] !== undefined) {
        let currentData = currentRecord[key];
        if (currentData instanceof OFormValue) {
          currentData = currentData.value;
        }
        filter[key] = currentData;
      }
    });
    return filter;
  }

  isInQueryMode(): boolean {
    return this.mode === OFormComponent.Mode().QUERY;
  }

  isInInsertMode(): boolean {
    return this.mode === OFormComponent.Mode().INSERT;
  }

  isInUpdateMode(): boolean {
    return this.mode === OFormComponent.Mode().UPDATE;
  }

  isInInitialMode(): boolean {
    return this.mode === OFormComponent.Mode().INITIAL;
  }

  setQueryMode() {
    this.setFormMode(OFormComponent.Mode().QUERY);
  }

  setInsertMode() {
    this.setFormMode(OFormComponent.Mode().INSERT);
  }

  setUpdateMode() {
    this.setFormMode(OFormComponent.Mode().UPDATE);
  }

  setInitialMode() {
    this.setFormMode(OFormComponent.Mode().INITIAL);
  }

  registerDynamicFormComponent(dynamicForm) {
    if (!Util.isDefined(dynamicForm)) {
      return;
    }
    const self = this;
    this.dynamicFormSubscription = dynamicForm.render.subscribe(res => {
      if (res) {
        self.refreshComponentsEditableState();
        if (!self.isInInsertMode() && self.queryOnInit) {
          self._reloadAction(true);
        }
        if (self.formParentKeysValues) {
          Object.keys(self.formParentKeysValues).forEach(parentKey => {
            const value = self.formParentKeysValues[parentKey];
            const comp = self.getFieldReference(parentKey);
            if (Util.isFormDataComponent(comp) && comp.isAutomaticBinding()) {
              comp.setValue(value, {
                emitModelToViewChange: false,
                emitEvent: false
              });
            }
          });
        }
      }
    });
  }

  unregisterDynamicFormComponent(dynamicForm) {
    if (dynamicForm && this.dynamicFormSubscription) {
      this.dynamicFormSubscription.unsubscribe();
    }
  }

  getRequiredComponents(): object {
    const requiredCompontents: object = {};
    const components = this.getComponents();
    if (components) {
      Object.keys(components).forEach(key => {
        const comp = components[key];
        const attr = comp.getAttribute();
        if ((comp as any).isRequired && attr && attr.length > 0) {
          requiredCompontents[attr] = comp;
        }
      });
    }
    return requiredCompontents;
  }

  get layoutDirection(): string {
    return this._layoutDirection;
  }

  set layoutDirection(val: string) {
    const parsedVal = (val || '').toLowerCase();
    this._layoutDirection = ['row', 'column', 'row-reverse', 'column-reverse'].indexOf(parsedVal) !== -1 ? parsedVal : OFormComponent.DEFAULT_LAYOUT_DIRECTION;
  }

  get layoutAlign(): string {
    return this._layoutAlign;
  }

  set layoutAlign(val: string) {
    this._layoutAlign = val;
  }

  get showFloatingToolbar(): boolean {
    return this.showHeader && this.headerMode === 'floating';
  }

  get showNotFloatingToolbar(): boolean {
    return this.showHeader && this.headerMode !== 'floating';
  }

  isEditableDetail() {
    return this.editableDetail;
  }

  isInitialStateChanged(): boolean {
    return this.formCache.isInitialStateChanged();
  }

  _undoLastChangeAction() {
    this.formCache.undoLastChange();
  }

  get isCacheStackEmpty(): boolean {
    return this.formCache.isCacheStackEmpty;
  }

  undoKeyboardPressed() {
    this.formCache.undoLastChange({
      keyboardEvent: true
    });
  }

  getFormToolbar(): OFormToolbarComponent {
    return this._formToolbar;
  }

  getFormManager(): OFormLayoutManagerComponent {
    return this.formNavigation.formLayoutManager;
  }

  getFormNavigation(): OFormNavigationClass {
    return this.formNavigation;
  }

  getFormCache(): OFormCacheClass {
    return this.formCache;
  }

  getUrlParam(arg: string) {
    return this.getFormNavigation().getUrlParams()[arg];
  }

  getUrlParams() {
    return this.getFormNavigation().getUrlParams();
  }

  setUrlParamsAndReload(val: object) {
    this.formNavigation.setUrlParams(val);
    this._reloadAction(true);
  }

  getRegisteredFieldsValues() {
    const values = {};
    const components: IFormDataComponentHash = this.getComponents();
    const self = this;
    const componentsKeys = Object.keys(components).filter(key => self.ignoreFormCacheKeys.indexOf(key) === -1);
    componentsKeys.forEach(compKey => {
      const comp: IFormDataComponent = components[compKey];
      values[compKey] = comp.getValue();
    });
    return values;
  }

  /**
   * Return the current value of the control in the form
   * @param attr
   */
  getFieldValue(attr: string): any {
    let value = null;
    const comp = this.getFieldReference(attr);
    if (comp) {
      value = comp.getValue();
    }
    return value;
  }

  /**
   * Return an object with the values of each attribute
   * @param attrs
   */
  getFieldValues(attrs: string[]): any {
    const self = this;
    const arr = {};
    attrs.forEach((key) => {
      arr[key] = self.getFieldValue(key);
    });
    return arr;

  }

  /**
   * Sets the value of the control in the form.
   * @param attr attribute of control
   * @param value value
   */
  setFieldValue(attr: string, value: any, options?: FormValueOptions) {
    const comp = this.getFieldReference(attr);
    if (comp) {
      comp.setValue(value, options);
    }
  }

  /**
   * Sets the value of each control in the form.
   * @param values
   */
  setFieldValues(values: any, options?: FormValueOptions) {
    for (const key in values) {
      if (values.hasOwnProperty(key)) {
        this.setFieldValue(key, values[key], options);
      }
    }
  }

  /**
   * Clear the value of each control in the form
   * @param attr
   */
  clearFieldValue(attr: string, options?: FormValueOptions) {
    const comp = this.getFieldReference(attr);
    if (comp) {
      comp.clearValue(options);
    }
  }

  /**
   * Reset the value of each control in the form
   * @param attrs
   */
  clearFieldValues(attrs: string[], options?: FormValueOptions) {
    const self = this;
    attrs.forEach((key) => {
      self.clearFieldValue(key, options);
    });
  }

  /**
   * Retrieves the reference of the control in the form.
   * @param attr
   */
  getFieldReference(attr: string): IFormDataComponent {
    return this._components[attr];
  }
  /**
   * Retrieves the reference of each control in the form
   * @param attrs
   */
  getFieldReferences(attrs: string[]): IFormDataComponentHash {
    const arr: IFormDataComponentHash = {};
    const self = this;
    attrs.forEach((key, index) => {
      arr[key] = self.getFieldReference(key);
    });
    return arr;
  }

  getFormComponentPermissions(attr: string): OPermissions {
    let permissions: OPermissions;
    if (Util.isDefined(this.permissions)) {
      permissions = (this.permissions.components || []).find(comp => comp.attr === attr);
    }
    return permissions;
  }

  getActionsPermissions(): OPermissions[] {
    let permissions: OPermissions[];
    if (Util.isDefined(this.permissions)) {
      permissions = (this.permissions.actions || []);
    }
    return permissions;
  }

  protected determinateFormMode(): void {
    const urlSegments = this.formNavigation.getUrlSegments();
    if (urlSegments.length > 0) {
      const segment = urlSegments[urlSegments.length - 1];
      this.determinateModeFromUrlSegment(segment);
    } else if (this.actRoute.parent) {
      this.actRoute.parent.url.subscribe(segments => {
        const segment = segments[segments.length - 1];
        this.determinateModeFromUrlSegment(segment);
      });
    } else {
      this.setFormMode(OFormComponent.Mode().INITIAL);
    }
    // stayInRecordAfterEdit is true if form has editable detail = true
    this.stayInRecordAfterEdit = this.stayInRecordAfterEdit || this.isEditableDetail();
  }

  protected determinateModeFromUrlSegment(segment: UrlSegment): void {
    const _path = segment ? segment.path : '';
    if (this.isInsertModePath(_path)) {
      this.setInsertMode();
      return;
    } else if (this.isUpdateModePath(_path)) {
      this.setUpdateMode();
    } else {
      this.setInitialMode();
    }
  }

  protected _updateFormData(newFormData: object): void {
    const self = this;
    this.zone.run(() => {
      this.formData = newFormData;
      const components = this.getComponents();
      if (components) {
        Object.keys(components).forEach(key => {
          const comp = components[key];
          if (Util.isFormDataComponent(comp)) {
            try {
              if (comp.isAutomaticBinding()) {
                comp.data = self.getDataValue(key);
              }
            } catch (error) {
              console.error(error);
            }
          }
        });
        self.initializeFields();
      }
    });
  }

  protected initializeFields(): void {
    Object.keys(this.formGroup.controls).forEach(control => {
      this.formGroup.controls[control].markAsPristine();
    });
    this.formCache.registerCache();
    this.formNavigation.updateNavigation();
  }

  protected clearComponentsOldValue(): void {
    const components: IFormDataComponentHash = this.getComponents();
    const self = this;
    const componentsKeys = Object.keys(components).filter(key => self.ignoreFormCacheKeys.indexOf(key) === -1);
    componentsKeys.forEach(compKey => {
      const comp: IFormDataComponent = components[compKey];
      (comp as any).oldValue = undefined;
      comp.getFormControl().setValue(undefined);
    });
  }

  protected postCorrectInsert(result: any): void {
    this.snackBarService.open('MESSAGES.INSERTED', { icon: 'check_circle' });
    this.onInsert.emit(result);
  }

  protected postIncorrectInsert(result: any): void {
    this.showError('insert', result);
  }

  protected postIncorrectDelete(result: any): void {
    this.showError('delete', result);
  }

  protected postIncorrectUpdate(result: any): void {
    this.showError('update', result);
  }

  protected postCorrectUpdate(result: any): void {
    this.snackBarService.open('MESSAGES.SAVED', { icon: 'check_circle' });
    this.onUpdate.emit(result);
  }

  protected postCorrectDelete(result: any): void {
    this.snackBarService.open('MESSAGES.DELETED', { icon: 'check_circle' });
    this.onDelete.emit(result);
  }

  protected markFormLayoutManagerToUpdate(): void {
    const formLayoutManager = this.getFormManager();
    if (Util.isDefined(formLayoutManager)) {
      formLayoutManager.markForUpdate = true;
    }
  }

  protected objectToFormValueData(data: object = {}): object {
    const valueData = {};
    Object.keys(data).forEach((item) => {
      valueData[item] = new OFormValue(data[item]);
    });
    return valueData;
  }

  protected getCurrentKeysValues(): object {
    return this.formNavigation.getCurrentKeysValues();
  }

  protected refreshComponentsEditableState(): void {
    switch (this.mode) {
      case OFormComponent.Mode().INITIAL:
        this._setComponentsEditable(this.isEditableDetail());
        break;
      case OFormComponent.Mode().INSERT:
      case OFormComponent.Mode().UPDATE:
        this._setComponentsEditable(true);
        break;
      default:
        break;
    }
  }

  protected isInsertModePath(path: string): boolean {
    const navData: ONavigationItem = this.navigationService.getLastItem();
    return Util.isDefined(navData) && path === navData.getInsertFormRoute();
  }

  protected isUpdateModePath(path: string): boolean {
    const navData: ONavigationItem = this.navigationService.getPreviousRouteData();
    return Util.isDefined(navData) && path === navData.getEditFormRoute();
  }

  private showError(operation: string, result: any): void {
    if (result && typeof result !== 'object') {
      this.dialogService.alert('ERROR', result);
    } else {
      let message = 'MESSAGES.ERROR_DELETE';
      switch (operation) {
        case 'update':
          message = 'MESSAGES.ERROR_UPDATE';
          break;
        case 'insert':
          message = 'MESSAGES.ERROR_INSERT';
          break;
      }
      this.dialogService.alert('ERROR', message);
    }
  }

}
