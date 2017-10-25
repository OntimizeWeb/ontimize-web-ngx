import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  Injector,
  NgZone,
  ChangeDetectorRef,
  NgModule,
  HostListener,
  ViewEncapsulation,
  ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, UrlSegment, UrlSegmentGroup } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';

import { dataServiceFactory } from '../../services/data-service.provider';
import { OntimizeService, DialogService, NavigationService } from '../../services';
import { InputConverter } from '../../decorators';
import { IFormControlComponent, IFormDataTypeComponent } from '../o-form-data-component.class';
import { IComponent } from '../o-component.class';
import { OFormToolbarModule, OFormToolbarComponent } from './o-form-toolbar.component';
import { OFormValue } from './OFormValue';
import { Util, SQLTypes } from '../../utils';
import { OSharedModule } from '../../shared';

import { CanDeactivateFormGuard } from './guards/o-form-can-deactivate.guard';

export const DEFAULT_INPUTS_O_FORM = [
  // show-header [boolean]: visibility of form toolbar. Default: yes.
  'showHeader: show-header',

  // header-mode [string][ none | floating]: painting mode of form toolbar. Default: 'floating'
  'headerMode: header-mode',

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

  // stay-in-record-after-insert [string][yes|no|true|false]: shows detail form after insert new record. Default: false;
  'stayInRecordAfterInsert: stay-in-record-after-insert',

  // stay-in-record-after-edit [string][yes|no|true|false]: shows edit form after edit a record. Default: false;
  'stayInRecordAfterEdit: stay-in-record-after-edit',

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

  // layout-fill [string][yes|no|true|false]: Default: true;
  'layoutFill: layout-fill',

  // layout-direction [string][column|row]: Default: column
  'layoutDirection: layout-direction',

  // editable-detail [string][yes|no|true|false]: Default: true;
  'editableDetail: editable-detail'
];

export const DEFAULT_OUTPUTS_O_FORM = [
  'onFormDataLoaded',
  'beforeCloseDetail',
  'beforeGoEditMode',
  'onFormModeChange'
];

export interface OFormInitializationOptions {
  entity?: string;
  service?: string;
  columns?: string;
  visibleColumns?: string;
  keys?: string;
  sortColumns?: string;
  editableColumns?: string;
  parentKeys?: string;
}

@Component({
  selector: 'o-form',
  providers: [
    { provide: OntimizeService, useFactory: dataServiceFactory, deps: [Injector] }
  ],
  templateUrl: './o-form.component.html',
  styleUrls: ['./o-form.component.scss'],
  inputs: DEFAULT_INPUTS_O_FORM,
  outputs: DEFAULT_OUTPUTS_O_FORM,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-form]': 'true',
    '[class.fill]': 'layoutFill'
  }
})
export class OFormComponent implements OnInit, OnDestroy {
  public static BACK_ACTION: string = 'BACK';
  public static CLOSE_DETAIL_ACTION: string = 'CLOSE';
  public static RELOAD_ACTION: string = 'RELOAD';
  public static GO_EDIT_ACTION: string = 'GO_EDIT';
  public static EDIT_ACTION: string = 'EDIT';
  public static INSERT_ACTION: string = 'INSERT';
  public static GO_INSERT_ACTION: string = 'GO_INSERT';
  public static DELETE_ACTION: string = 'DELETE';

  public static PARENT_KEYS_KEY = 'pk';

  public static DEFAULT_INPUTS_O_FORM = DEFAULT_INPUTS_O_FORM;
  public static DEFAULT_OUTPUTS_O_FORM = DEFAULT_OUTPUTS_O_FORM;

  public static DEFAULT_QUERY_METHOD = 'query';
  public static DEFAULT_INSERT_METHOD = 'insert';
  public static DEFAULT_UPDATE_METHOD = 'update';
  public static DEFAULT_DELETE_METHOD = 'delete';

  public static DEFAULT_LAYOUT_DIRECTION = 'column';

  @InputConverter()
  showHeader: boolean = true;
  headerMode: string = 'floating';
  labelheader: string = '';
  labelHeaderAlign: string = 'center';
  headeractions: string = '';
  showHeaderActionsText: string = 'yes';
  entity: string;
  keys: string = '';
  columns: string = '';
  service: string;
  @InputConverter()
  stayInRecordAfterInsert: boolean = false;
  @InputConverter()
  stayInRecordAfterEdit: boolean = false;
  serviceType: string;
  @InputConverter()
  protected queryOnInit: boolean = true;
  protected parentKeys: string;
  protected queryMethod: string;
  protected insertMethod: string;
  protected updateMethod: string;
  protected deleteMethod: string;
  @InputConverter()
  layoutFill: boolean = true;
  protected _layoutDirection: string = OFormComponent.DEFAULT_LAYOUT_DIRECTION;
  @InputConverter()
  protected editableDetail: boolean = true;

  isDetailForm: boolean = false;
  keysArray: string[] = [];
  colsArray: string[] = [];
  dataService: any;
  _pKeysEquiv = {};

  formGroup: FormGroup;
  onFormDataLoaded: EventEmitter<Object> = new EventEmitter<Object>();
  beforeCloseDetail: EventEmitter<any> = new EventEmitter<any>();
  beforeGoEditMode: EventEmitter<any> = new EventEmitter<any>();
  onFormModeChange: EventEmitter<Object> = new EventEmitter<Object>();

  public loading: boolean = false;
  public formData: Object = {};/* Array<any> = [];*/
  public navigationData: Array<any> = [];
  public currentIndex = 0;
  public mode: number = OFormComponent.Mode().INITIAL;

  protected dialogService: DialogService;
  protected navigationService: NavigationService;

  protected _formToolbar: OFormToolbarComponent;

  protected _components: Object = {};
  protected _compSQLTypes: Object = {};

  protected qParamSub: any;
  protected queryParams: any;

  protected urlParamSub: any;
  public urlParams: Object;

  protected urlSub: any;
  protected urlSegments: any;

  protected initialDataCache: Object = {};
  protected formDataCache: Object;
  protected formParentKeysValues: Object;
  protected hasScrolled: boolean = false;

  public onFormInitStream: EventEmitter<Object> = new EventEmitter<Object>();
  public onUrlParamChangedStream: EventEmitter<Object> = new EventEmitter<Object>();
  protected reloadStream: Observable<any>;

  protected querySubscription: Subscription;
  protected loaderSubscription: Subscription;
  protected formCacheSubscription: Subscription;
  protected dynamicFormSubscription: Subscription;

  protected deactivateGuard: CanDeactivateFormGuard;

  public static Mode(): any {
    enum m {
      QUERY,
      INSERT,
      UPDATE,
      INITIAL
    }
    return m;
  }

  @HostListener('window:scroll', ['$event'])
  track(event) {
    if (this.showHeader && event.currentTarget instanceof Window) {
      let win: Window = event.currentTarget;
      if (win.scrollY > 50) {
        this.hasScrolled = true;
      } else {
        this.hasScrolled = false;
      }
    }
  }

  constructor(
    protected router: Router,
    protected actRoute: ActivatedRoute,
    protected zone: NgZone,
    protected cd: ChangeDetectorRef,
    protected injector: Injector,
    protected elRef: ElementRef) {

    this.dialogService = injector.get(DialogService);
    this.navigationService = injector.get(NavigationService);

    this.reloadStream = Observable.combineLatest(
      this.onFormInitStream.asObservable(),
      this.onUrlParamChangedStream.asObservable()
    );

    var self = this;
    this.reloadStream.subscribe(valArr => {
      if (Util.isArray(valArr) && valArr.length === 2) {
        if (self.queryOnInit && valArr[0] === true && valArr[1] === true) {
          self._reloadAction(true);
        }
      }
    });
  }

  registerFormComponent(comp: any) {
    if (comp) {
      let attr = comp.getAttribute();
      if (attr && attr.length > 0) {
        this._components[attr] = comp;

        // Setting parent key values...
        if (this.formParentKeysValues &&
          this.formParentKeysValues[attr] !== undefined) {
          let val = this.formParentKeysValues[attr];
          this._components[attr].setValue(val);
        }

        /*
        * TODO. Check it!!!
        * En un formulario con tabs, cuando se cambia de uno a otro, se destruyen las vistas
        * de los componentes hijo del formulario.
        * formDataCache contiene los valores (originales ó editados) de los campos del formulario.
        * La idea es asignar ese valor al campo cuando se registre de nuevo (Hay que asegurar el proceso
        * para que sólo sea cuando se registra de nuevo ;) )
        */
        if (this.formDataCache && this.formDataCache.hasOwnProperty(attr)
          && this.getDataValues() && this._components.hasOwnProperty(attr)) {
          let cachedValue = this.formDataCache[attr];
          if (cachedValue !== null) {
            this._components[attr].setValue(cachedValue);
          }
        }
      }
    }
  }

  registerSQLTypeFormComponent(comp: IFormDataTypeComponent) {
    if (comp) {
      let type = comp.getSQLType();
      let attr = comp.getAttribute();
      if (type !== SQLTypes.OTHER && attr && attr.length > 0) {
        // Right now just store values different of 'OTHER'
        this._compSQLTypes[attr] = type;
      }
    }
  }

  registerFormControlComponent(comp: IFormControlComponent) {
    if (comp) {
      let attr = comp.getAttribute();
      if (attr && attr.length > 0) {
        let control: FormControl = comp.getControl();
        if (control) {
          this.formGroup.registerControl(attr, control);
        }
      }
    }
  }

  unregisterFormComponent(comp: IComponent) {
    if (comp) {
      let attr = comp.getAttribute();
      if (attr && attr.length > 0) {
        delete this._components[attr];
      }
    }
  }

  unregisterFormControlComponent(comp: IFormControlComponent) {
    if (comp) {
      let control: FormControl = comp.getControl();
      let attr = comp.getAttribute();
      if (control && attr && attr.length > 0) {
        this.formGroup.removeControl(attr);
      }
    }
  }

  unregisterSQLTypeFormComponent(comp: IFormDataTypeComponent) {
    if (comp) {
      let attr = comp.getAttribute();
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

  public getComponents(): Object {
    return this._components;
  }

  public load(): any {
    var self = this;
    var loadObservable = new Observable(observer => {
      var timer = window.setTimeout(() => {
        observer.next(true);
      }, 250);

      return () => {
        window.clearTimeout(timer);
        self.loading = false;
      };

    });
    var subscription = loadObservable.subscribe(val => {
      self.loading = val as boolean;
    });
    return subscription;
  }

  getDataValue(attr: string) {
    if (this.isInInsertMode()) {
      let val = this.formGroup.value[attr];
      return new OFormValue(val);
    } else if (this.isInInitialMode() && !this.isEditableDetail()) {
      let data = this.formData;
      if (data && data.hasOwnProperty(attr)) {
        return data[attr];
      }
    } else if (this.isInUpdateMode() || this.isEditableDetail()) {
      if (this.formData && Object.keys(this.formData).length > 0) {
        if (this.formGroup.dirty && this.formDataCache &&
          this.formDataCache.hasOwnProperty(attr)) {
          let val = this.formDataCache[attr];
          if (val instanceof OFormValue) {
            return val;
          }
          return new OFormValue(val);
        } else {
          // Return original value stored into form data...
          let data = this.formData;
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
    let filter = {};
    if (this.urlParams) {
      for (let key in this.urlParams) {
        if (this.urlParams.hasOwnProperty(key)) {
          filter[key] = this.urlParams[key];
        }
      }
    }
    setTimeout(() => {
      this._setData(filter);
    }, 0);
  }

  showConfirmDiscardChanges() {
    let subscription = undefined;
    if (this.isInitialStateChanged()) {
      subscription = this.dialogService.confirm('CONFIRM', 'MESSAGES.FORM_CHANGES_WILL_BE_LOST');
    }
    if (subscription === undefined) {
      let observable = Observable.create(observer => {
        setTimeout(() => {
          observer.next(true);
          observer.complete();
        }, 100);
      });
      subscription = observable.toPromise();
    }
    return subscription;
  }

  executeToolbarAction(action: string, options?: any) {
    switch (action) {
      case OFormComponent.BACK_ACTION: this._backAction(); break;
      case OFormComponent.CLOSE_DETAIL_ACTION: this._closeDetailAction(options); break;
      case OFormComponent.RELOAD_ACTION: this._reloadAction(true); break;
      case OFormComponent.GO_INSERT_ACTION: this._goInsertMode(options); break;
      case OFormComponent.INSERT_ACTION: this._insertAction(); break;
      case OFormComponent.GO_EDIT_ACTION: this._goEditMode(options); break;
      case OFormComponent.EDIT_ACTION: this._editAction(); break;
      case OFormComponent.DELETE_ACTION: return this._deleteAction();
      default: break;
    }
    return undefined;
  }

  ngOnInit(): void {
    // stayInRecordAfterEdit is true if form has editable detail = true
    this.stayInRecordAfterEdit = this.stayInRecordAfterEdit || this.isEditableDetail();

    this.addDeactivateGuard();

    this.formGroup = new FormGroup({});
    var self = this;
    /*
    * Keeping updated a cache of form data values
    */
    this.formCacheSubscription = this.formGroup.valueChanges.subscribe((value: any) => {
      if (self.formDataCache === undefined) {
        // initialize cache
        self.formDataCache = {};
      }
      Object.assign(self.formDataCache, value);
    });
    this.initialize();
  }

  addDeactivateGuard() {
    if (this.isInInitialMode() && !this.isEditableDetail()) {
      return;
    }
    this.deactivateGuard = this.injector.get(CanDeactivateFormGuard);
    this.deactivateGuard.setForm(this);
    let canDeactivateArray = (this.actRoute.routeConfig.canDeactivate || []);
    let previouslyAdded = false;
    for (let i = 0, len = canDeactivateArray.length; i < len; i++) {
      previouslyAdded = (canDeactivateArray[i].name === 'CanDeactivateFormGuard');
      if (previouslyAdded) {
        break;
      }
    }
    if (!previouslyAdded) {
      canDeactivateArray.push(this.deactivateGuard.constructor);
      this.actRoute.routeConfig.canDeactivate = canDeactivateArray;
      this.router.resetConfig(this.router.config);
    }
  }

  destroyDeactivateGuard() {
    if (this.deactivateGuard) {
      this.deactivateGuard.setForm(undefined);
      for (let i = this.actRoute.routeConfig.canDeactivate.length - 1; i >= 0; i--) {
        if (this.actRoute.routeConfig.canDeactivate[i].name === 'CanDeactivateFormGuard') {
          this.actRoute.routeConfig.canDeactivate.splice(i, 1);
          break;
        }
      }
      this.router.resetConfig(this.router.config);
    }
  }

  /**
  * Angular methods
  */
  initialize() {
    var self = this;
    if (this.headeractions === 'all') {
      this.headeractions = 'R;I;U;D';
    }
    this.keysArray = Util.parseArray(this.keys);
    this.colsArray = Util.parseArray(this.columns);
    let pkArray = Util.parseArray(this.parentKeys);
    this._pKeysEquiv = Util.parseParentKeysEquivalences(pkArray);

    if (!this.queryMethod) {
      this.queryMethod = OFormComponent.DEFAULT_QUERY_METHOD;
    }

    if (!this.insertMethod) {
      this.insertMethod = OFormComponent.DEFAULT_INSERT_METHOD;
    }

    if (!this.updateMethod) {
      this.updateMethod = OFormComponent.DEFAULT_UPDATE_METHOD;
    }

    if (!this.deleteMethod) {
      this.deleteMethod = OFormComponent.DEFAULT_DELETE_METHOD;
    }

    this.configureService();

    let qParamObs = this.actRoute.queryParams;
    this.qParamSub = qParamObs.subscribe(params => {
      if (params) {
        this.queryParams = params;
        let isDetail = params['isdetail'];
        if (isDetail === 'true') {
          this.isDetailForm = true;
        } else {
          this.isDetailForm = false;
        }
      }
    });

    this.urlParamSub = this.actRoute.params.subscribe(params => {
      self.urlParams = params;
      if (params[OFormComponent.PARENT_KEYS_KEY] !== undefined) {
        self.formParentKeysValues = Util.decodeParentKeys(params[OFormComponent.PARENT_KEYS_KEY]);
      }
      //TODO Obtain 'datatype' of each key contained into urlParams for
      // for building correctly query filter!!!!
      if (self.urlParams && Object.keys(self.urlParams).length > 0) {
        self.onUrlParamChangedStream.emit(true);
      }
    });

    this.urlSub = this.actRoute.url.subscribe(urlSegments => {
      self.urlSegments = urlSegments;
    });

    if (this.navigationService) {
      this.navigationService.onVisibleChange(visible => {
        self.showHeader = visible;
      });
    }

    this.mode = OFormComponent.Mode().INITIAL;
  }

  reinitialize(options: OFormInitializationOptions) {
    if (options && Object.keys(options).length) {
      let clonedOpts = Object.assign({}, options);
      for (var prop in clonedOpts) {
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
        let serviceCfg = this.dataService.getDefaultServiceConfiguration(this.service);
        if (this.entity) {
          serviceCfg['entity'] = this.entity;
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
    if (this.urlParamSub) {
      this.urlParamSub.unsubscribe();
    }
    if (this.qParamSub) {
      this.qParamSub.unsubscribe();
    }
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
    if (this.loaderSubscription) {
      this.loaderSubscription.unsubscribe();
    }
    if (this.formCacheSubscription) {
      this.formCacheSubscription.unsubscribe();
    }
    this.formDataCache = undefined;
    this.destroyDeactivateGuard();
  }

  ngAfterViewInit() {
    this.determinateFormMode();
    this.onFormInitStream.emit(true);
  }

  protected determinateFormMode() {
    if (this.urlSegments.length > 0) {
      let segment = this.urlSegments[this.urlSegments.length - 1];
      this.determinateModeFromUrlSegment(segment);
    } else if (this.actRoute.parent) {
      this.actRoute.parent.url.subscribe(segments => {
        let segment = segments[segments.length - 1];
        this.determinateModeFromUrlSegment(segment);
      });
    } else {
      this.setFormMode(OFormComponent.Mode().INITIAL);
    }
  }

  protected determinateModeFromUrlSegment(segment: UrlSegment) {
    var _path = segment ? segment['path'] : '';
    if (_path === 'new') {
      this.setInsertMode();
      return;
    } else if (_path === 'edit') {
      this.setUpdateMode();
    } else {
      this.setInitialMode();
    }
  }

  /**
   * Inner methods
   * */

  _setComponentsEditable(state: boolean) {
    var self = this;
    //  window.setTimeout(() => {
    let comps: any = self.getComponents();
    if (comps) {
      let keys = Object.keys(comps);
      keys.forEach(element => {
        comps[element].isReadOnly = !state;
      });
    }
    // },100);
  }


  /**
   * Sets form operation mode.
   * @param  {Mode} mode The mode to be established
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
      default:
        break;
    }
  }

  _setData(data) {
    if (Util.isArray(data) && data.length === 1) {
      let currentData = data[0];
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

  protected _updateFormData(newFormData: Object) {
    this.zone.run(() => {
      this.formData = newFormData;
      if (this._components) {
        var self = this;
        Object.keys(this._components).forEach(key => {
          let comp = this._components[key];
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
        self.initialDataCache = self.formGroup.getRawValue();
        (self.formGroup.valueChanges as EventEmitter<any>).emit(self.initialDataCache);
      }
    });
  }

  _emitData(data) {
    this.onFormDataLoaded.emit(data);
  }

  _backAction() {
    this.router.navigate(['../../'], { relativeTo: this.actRoute })
      .catch(err => {
        console.error(err.message);
      });
  }

  _closeDetailAction(options?: any) {
    this.beforeCloseDetail.emit();
    var fullUrlSegments = this.getFullUrlSegments();
    var thisUrlSegments = this.urlSegments.slice(0);
    // Copy current url segments array...
    let urlArray = fullUrlSegments.length ? fullUrlSegments : thisUrlSegments;
    //TODO do it better (maybe propagation nested level number?)
    let nestedLevelN = this.getNestedLevelsNumber();
    // Extract segments for proper navigation...
    if (nestedLevelN > 3) {
      if (this.isInUpdateMode()) {
        urlArray.pop();
      } else if (this.isInInitialMode() || this.isInInsertMode()) {
        urlArray.pop();
        urlArray.pop();
      }
    } else {
      urlArray.pop();
    }
    // If we are in nested detail form we have to go up two levels
    // home/:key/subhome/:key2
    let urlText = '';
    if (urlArray) {
      urlArray.forEach((item, index) => {
        urlText += item['path'];
        if (index < urlArray.length - 1) {
          urlText += '/';
        }
      });
    }

    let extras = {};
    if (nestedLevelN > 3 || this.urlSegments.length > 1 && this.isDetailForm) {
      extras['queryParams'] = Object.assign({}, this.queryParams, { 'isdetail': 'true' });
    }

    this.router.navigate([urlText], extras).then(val => {
      if (val && options && options.changeToolbarMode) {
        this._formToolbar.setInitialMode();
      }
    }).catch(err => {
      console.error(err.message);
    });

  }

  _stayInRecordAfterInsert(insertedKeys: Object) {

    var fullUrlSegments = this.getFullUrlSegments();
    // Copy current url segments array...
    let urlArray = fullUrlSegments.length ? fullUrlSegments : this.urlSegments.slice(0);

    let nestedLevelN = this.getNestedLevelsNumber();

    // Extract segments for proper navigation...
    if (nestedLevelN > 3) {
      urlArray.pop();
      urlArray.pop();
    } else {
      urlArray.pop();
    }

    let urlText = '';
    if (urlArray) {
      urlArray.forEach((item, index) => {
        urlText += item['path'];
        if (index < urlArray.length - 1) {
          urlText += '/';
        }
      });
    }

    if (this.keysArray && insertedKeys) {
      urlText += '/';
      this.keysArray.forEach((current, index) => {
        if (insertedKeys[current]) {
          urlText += insertedKeys[current];
          if (index < this.keysArray.length - 1) {
            urlText += '/';
          }
        }
      });
    }

    let extras = Object.assign({}, this.queryParams, { 'isdetail': 'true' });

    this.router.navigate([urlText], extras)
      .catch(err => {
        console.error(err.message);
      });
  }

  _reloadAction(useFilter: boolean = false) {
    let filter = {};
    if (useFilter) {
      filter = this.getCurrentKeysValues();
    }
    this.restartCache();
    this.queryData(filter);
  }

  /**
   * Navigates to 'insert' mode
   */
  _goInsertMode(options?: any) {
    let extras = { relativeTo: this.actRoute };
    this.router.navigate(['../', 'new'], extras).then((val) => {
      if (val && options && options.changeToolbarMode) {
        this._formToolbar.setInsertMode();
      }
    }).catch(err => {
      console.error(err.message);
    });
  }

  /**
   * Performs insert action.
   */
  _insertAction() {

    Object.keys(this.formGroup.controls).forEach(
      (control) => {
        this.formGroup.controls[control].markAsTouched();
      }
    );

    if (!this.formGroup.valid) {
      this.dialogService.alert('ERROR', 'MESSAGES.FORM_VALIDATION_ERROR');
      return;
    }

    var self = this;
    let values = this.getAttributesValuesToInsert();
    let sqlTypes = this.getAttributesSQLTypes();
    this.insertData(values, sqlTypes).subscribe(resp => {
      self.postCorrectInsert(resp);
      //TODO mostrar un toast indicando que la operación fue correcta...
      if (self.stayInRecordAfterInsert) {
        this._stayInRecordAfterInsert(resp);
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

    this.beforeGoEditMode.emit();

    let url = '';
    this.keysArray.map(key => {
      if (this.urlParams[key]) {
        url += this.urlParams[key];
      }
    });

    let extras = { relativeTo: this.actRoute };
    if (this.isDetailForm) {
      extras['queryParams'] = { 'isdetail': 'true' };
    }
    extras['queryParams'] = Object.assign({}, this.queryParams, extras['queryParams'] || {});
    this.router.navigate(['../', url, 'edit'], extras).then((val) => {
      if (val && options && options.changeToolbarMode) {
        this._formToolbar.setEditMode();
      }
    }).catch(err => {
      console.error(err.message);
    });
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
    var self = this;
    let filter = this.getKeysValues();

    // retrieving values to update...
    let values = this.getAttributesValuesToUpdate();
    let sqlTypes = this.getAttributesSQLTypes();

    if (Object.keys(values).length === 0) {
      //Nothing to update
      this.dialogService.alert('INFO', 'MESSAGES.FORM_NOTHING_TO_UPDATE_INFO');
      return;
    }

    // invoke update method...
    this.updateData(filter, values, sqlTypes).subscribe(resp => {
      self.postCorrectUpdate(resp);
      // TODO mostrar un toast indicando que la operación fue correcta...
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
    var self = this;
    let filter = {};
    this.keysArray.map(key => {
      filter[key] = self.urlParams[key];
    });
    return this.deleteData(filter);
  }

  /*
  Utility methods
  */

  queryData(filter) {
    if (this.dataService === undefined) {
      console.warn('No service configured! aborting query');
      return;
    }
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
    if (this.loaderSubscription) {
      this.loaderSubscription.unsubscribe();
    }
    var self = this;
    this.loaderSubscription = this.load();
    let av = this.getAttributesToQuery();
    let sqlTypes = this.getAttributesSQLTypes();
    this.querySubscription = this.dataService[this.queryMethod](filter, av, this.entity, sqlTypes).subscribe(resp => {
      self.loaderSubscription.unsubscribe();
      if (resp.code === 0) {
        self._setData(resp.data);
      } else {
        self._updateFormData({});
        self.dialogService.alert('ERROR', 'MESSAGES.ERROR_QUERY');
        console.log('error ');
      }
    }, err => {
      console.log(err);
      self._updateFormData({});
      self.dialogService.alert('ERROR', 'MESSAGES.ERROR_QUERY');
      self.loaderSubscription.unsubscribe();
    });
  }

  getAttributesToQuery(): Array<any> {
    let attributes: Array<any> = [];
    // add form keys...
    if (this.keysArray && this.keysArray.length > 0) {
      attributes.push(...this.keysArray);
    }
    // add only the fields contained into the form...
    let keys = Object.keys(this._components);
    keys.map(item => {
      if (attributes.indexOf(item) < 0) {
        attributes.push(item);
      }
    });

    // add fields stored into form cache...
    if (this.formDataCache) {
      let keys = Object.keys(this.formDataCache);
      keys.map(item => {
        if (item !== undefined && attributes.indexOf(item) === -1) {
          attributes.push(item);
        }
      });
    }
    attributes = attributes.concat(this.colsArray.filter(col => attributes.indexOf(col) < 0));
    return attributes;
  }

  insertData(values, sqlTypes?: Object): Observable<any> {
    var self = this;
    var loader = self.load();
    let observable = new Observable(observer => {
      this.dataService[this.insertMethod](values, this.entity, sqlTypes)
        .subscribe(resp => {
          loader.unsubscribe();
          if (resp.code === 0) {
            observer.next(resp.data);
            observer.complete();
          } else {
            observer.error(resp.message);
          }
        }, err => {
          loader.unsubscribe();
          observer.error(err);
        });
    });
    return observable;
  }

  getAttributesValuesToInsert(): Object {
    let attrValues = {};
    if (this.formParentKeysValues) {
      Object.assign(attrValues, this.formParentKeysValues);
    }
    return Object.assign(attrValues, this.formGroup.value);
  }

  getAttributesSQLTypes(): Object {
    let types: Object = {};
    if (this._compSQLTypes && Object.keys(this._compSQLTypes).length > 0) {
      Object.assign(types, this._compSQLTypes);
    }
    return types;
  }

  protected postCorrectInsert(result: any) {
    console.log('[OFormComponent.postCorrectInsert]', result);
  }

  protected postIncorrectInsert(result: any) {
    console.log('[OFormComponent.postIncorrectInsert]', result);
    this.dialogService.alert('ERROR', 'MESSAGES.ERROR_INSERT');
  }

  updateData(filter, values, sqlTypes?: Object): Observable<any> {
    var self = this;
    var loader = self.load();
    let observable = new Observable(observer => {
      this.dataService[this.updateMethod](filter, values, this.entity, sqlTypes)
        .subscribe(resp => {
          loader.unsubscribe();
          if (resp.code === 0) {
            observer.next(resp.data);
            observer.complete();
          } else {
            observer.error(resp.message);
          }
        }, err => {
          loader.unsubscribe();
          observer.error(err);
        });
    });
    return observable;
  }

  getAttributesValuesToUpdate(): Object {
    let values = {};
    var self = this;
    Object.keys(this.formGroup.controls).forEach(function (item) {
      if (self.formGroup.controls[item].dirty === true) {
        values[item] = self.formGroup.value[item];
        if (values[item] === undefined) {
          values[item] = null;
        }
      }
    });
    return values;
  }

  protected postCorrectUpdate(result: any) {
    console.log('[OFormComponent.postCorrectUpdate]', result);
  }

  protected postIncorrectUpdate(result: any) {
    console.log('[OFormComponent.postIncorrectUpdate]', result);
    this.dialogService.alert('ERROR', 'MESSAGES.ERROR_UPDATE');
  }

  deleteData(filter): Observable<any> {
    var self = this;
    var loader = self.load();
    let observable = new Observable(observer => {
      this.dataService[this.deleteMethod](filter, this.entity)
        .subscribe(resp => {
          loader.unsubscribe();
          if (resp.code === 0) {
            self.postCorrectDelete(resp);
            observer.next(resp.data);
            observer.complete();
          } else {
            self.postIncorrectDelete(resp);
            observer.error(resp.message);
          }
        }, err => {
          loader.unsubscribe();
          self.postIncorrectDelete(err);
          observer.error(err);
        });
    });
    return observable;
  }

  protected postCorrectDelete(result: any) {
    console.log('[OFormComponent.postCorrectDelete]', result);
  }

  protected postIncorrectDelete(result: any) {
    console.log('[OFormComponent.postIncorrectDelete]', result);
    this.dialogService.alert('ERROR', 'MESSAGES.ERROR_DELETE');
  }


  toJSONData(data) {
    if (!data) {
      data = {};
    }
    let valueData = {};
    Object.keys(data).forEach(function (item) {
      valueData[item] = data[item].value;
    });
    return valueData;
  }

  toFormValueData(data) {
    if (data && Util.isArray(data)) {
      let valueData: Array<Object> = [];
      var self = this;
      data.forEach(item => {
        valueData.push(self.objectToFormValueData(item));
      });
      return valueData;
    } else if (data && Util.isObject(data)) {
      return this.objectToFormValueData(data);
    }
    return undefined;
  }

  protected objectToFormValueData(data: Object): Object {
    let valueData = {};

    if (!data) {
      data = {};
    }

    Object.keys(data).forEach(function (item) {
      valueData[item] = new OFormValue(data[item]);
    });
    return valueData;
  }

  protected getCurrentKeysValues() {
    let filter = {};

    if (this.urlParams && this.keysArray) {
      this.keysArray.map(key => {
        if (this.urlParams[key]) {
          filter[key] = this.urlParams[key];
        }
      });
    }

    let keys = Object.keys(this._pKeysEquiv);
    if (this.urlParams && keys && keys.length > 0) {
      keys.forEach(item => {
        let urlVal = this.urlParams[this._pKeysEquiv[item]];
        if (urlVal) {
          filter[item] = urlVal;
        }
      });
    }
    return filter;
  }

  protected getKeysValues() {
    let filter = {};
    let currentRecord = this.formData;
    if (this.keysArray) {
      this.keysArray.map(key => {
        if (currentRecord[key]) {
          let currentData = currentRecord[key];
          if (currentData instanceof OFormValue) {
            currentData = currentData.value;
          }
          filter[key] = currentData;
        }
      });
    }
    return filter;
  }

  protected getNestedLevelsNumber() {
    let actRoute = this.actRoute;
    let i = 0;
    while (actRoute.parent) {
      actRoute = actRoute.parent;
      actRoute.url.subscribe(function (x) {
        if (x && x.length) {
          i++;
        }
      });
    }
    return i;
  }

  protected getFullUrlSegments() {
    var fullUrlSegments = [];
    if (this.router && this.router.url && this.router.url.length) {
      var root: UrlSegmentGroup = this.router.parseUrl(this.router.url).root;
      if (root && root.hasChildren() && root.children.primary) {
        fullUrlSegments = root.children.primary.segments;
      }
    }
    return fullUrlSegments;
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
    // ensuring that editable detail is false
    this.editableDetail = false;
    this.setFormMode(OFormComponent.Mode().QUERY);
  }

  setInsertMode() {
    // ensuring that editable detail is false
    this.editableDetail = false;
    this.setFormMode(OFormComponent.Mode().INSERT);
  }

  setUpdateMode() {
    // ensuring that editable detail is false
    this.editableDetail = false;
    this.setFormMode(OFormComponent.Mode().UPDATE);
  }

  setInitialMode() {
    this.setFormMode(OFormComponent.Mode().INITIAL);
  }

  registerDynamicFormComponent(dynamicForm) {
    var self = this;
    if (dynamicForm) {
      this.dynamicFormSubscription = dynamicForm.render.subscribe(
        res => {
          if (res) {
            self._reloadAction(true);
          }
        }
      );
    }
  }

  unregisterDynamicFormComponent(dynamicForm) {
    if (dynamicForm) {
      this.dynamicFormSubscription.unsubscribe();
    }
  }

  getRequiredComponents(): Object {
    const requiredCompontents: Object = {};
    const components = this.getComponents();
    if (components) {
      Object.keys(components).forEach(key => {
        let comp = components[key];
        let attr = comp.getAttribute();
        if (comp.isRequired && attr && attr.length > 0) {
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
    this._layoutDirection = ['row', 'column'].indexOf(parsedVal) !== -1 ? parsedVal : OFormComponent.DEFAULT_LAYOUT_DIRECTION;
  }

  restartCache() {
    this.formDataCache = {};
    this.initialDataCache = {};
  }

  isEditableDetail() {
    return this.editableDetail;
  }

  isInitialStateChanged(): boolean {
    let res = false;
    let initialKeys = Object.keys(this.initialDataCache);
    let currentKeys = Object.keys(this.formDataCache);
    if (initialKeys.length !== currentKeys.length) {
      return true;
    }
    for (let i = 0, leni = initialKeys.length; i < leni; i++) {
      let key = initialKeys[i];
      // TODO be careful with types comparisions
      res = (this.initialDataCache[key] !== this.formDataCache[key]);
      if (res) {
        break;
      }
    }
    return res;
  }
}

@NgModule({
  declarations: [OFormComponent],
  imports: [OSharedModule, CommonModule, OFormToolbarModule],
  exports: [OFormComponent, OFormToolbarModule],
  providers: [{ provide: CanDeactivateFormGuard, useClass: CanDeactivateFormGuard }]
})
export class OFormModule {
}
