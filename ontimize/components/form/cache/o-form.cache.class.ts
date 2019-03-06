
import { Subscription } from 'rxjs';
import { EventEmitter } from '@angular/core';
import { Util } from '../../../utils';
import { IFormControlComponent, IFormDataComponent } from '../../o-form-data-component.class';
import { OFormComponent } from '../o-form.component';

export class OFormCacheClass {

  protected initialDataCache: Object = {};
  protected formDataCache: Object;
  protected valueChangesStack: Array<any> = [];
  protected _componentsSubscritpions: any = {};
  protected blockCaching: boolean = false;
  protected initializedCache: boolean = false;

  onCacheEmptyStateChanges: EventEmitter<boolean> = new EventEmitter<boolean>();
  onCacheStateChanges: EventEmitter<any> = new EventEmitter<any>();

  protected changedFormControls: string[] = [];

  constructor(protected form: OFormComponent) {
  }

  protected updateFormDataCache() {
    this.formDataCache = this.form.getRegisteredFieldsValues();
  }

  protected addChangeToStack(comp: IFormControlComponent) {
    const currentValue = comp.getFormControl().value;
    const wasEmpty = this.valueChangesStack.length === 0;
    this.valueChangesStack.push({
      attr: comp.getAttribute(),
      value: currentValue
    });
    if (wasEmpty) {
      this.onCacheEmptyStateChanges.emit(false);
    }
    this.onCacheStateChanges.emit();
  }

  protected registerComponentCaching(comp: IFormDataComponent) {
    const self = this;
    const attr = comp.getAttribute();
    const listenTo = this.form.detectChangesOnBlur ? comp.onValueChange : comp.onChange;
    if (!Util.isDefined(listenTo)) {
      return;
    }
    this._componentsSubscritpions[attr] = listenTo.subscribe(() => {
      if (self.initializedCache && !self.blockCaching && self.hasComponentChanged(attr, comp)) {
        if (self.changedFormControls.indexOf(attr) === -1) {
          self.changedFormControls.push(attr);
        }
        self.updateFormDataCache();
        self.addChangeToStack(comp);
      }
    });
  }

  getCachedValue(attr: string): any {
    if (this.formDataCache && this.formDataCache.hasOwnProperty(attr)) {
      return this.formDataCache[attr];
    }
    return undefined;
  }

  destroy() {
    Object.keys(this._componentsSubscritpions).forEach((attr) => {
      const subs: Subscription = this._componentsSubscritpions[attr];
      subs.unsubscribe();
    });
    this._componentsSubscritpions = {};
    this.formDataCache = undefined;
    this.changedFormControls = [];
  }

  protected removeUndefinedProperties(arg: any): any {
    Object.keys(arg).forEach((key) => {
      if (arg[key] === undefined) {
        delete arg[key];
      }
    });
    return arg;
  }

  registerCache() {
    let initialCache = this.form.getRegisteredFieldsValues();
    this.removeUndefinedProperties(initialCache);
    this.initializeCache(initialCache);
    this.formDataCache = initialCache;

    const components = this.form.getComponents();
    const self = this;
    Object.keys(components).forEach(attr => {
      const comp: IFormDataComponent = components[attr];
      if (comp.isAutomaticRegistering()) {
        self.registerComponentCaching(comp);
      }
    });
  }

  initializeCache(val: any) {
    this.initialDataCache = val;
    this.valueChangesStack = [];
    this.onCacheEmptyStateChanges.emit(true);
    this.initializedCache = true;
    this.changedFormControls = [];
  }

  getInitialDataCache() {
    return this.initialDataCache;
  }

  getDataCache() {
    return this.formDataCache;
  }

  restartCache() {
    this.formDataCache = undefined;
    this.initializeCache({});
    this.initializedCache = false;
    this.onCacheStateChanges.emit();
  }

  setCacheSnapshot() {
    this.initializeCache(this.getDataCache());
  }

  undoLastChange(options?) {
    options = (options || {});
    var lastElement = this.valueChangesStack[this.valueChangesStack.length - 1];
    if (lastElement) {
      const lastCacheValue = this.getCacheLastValue(lastElement.attr);
      const lastValue = (lastCacheValue !== null) ? lastCacheValue : this.initialDataCache[lastElement.attr];
      this.undoComponentValue(lastElement.attr, lastValue);

      this.updateFormDataCache();
      this.onCacheStateChanges.emit();
    }
  }

  protected undoComponentValue(attr: string, val: any) {
    this.blockCaching = true;
    const comp = this.form.getFieldReference(attr);
    if (comp) {
      // (comp as any).oldValue = undefined;
      comp.setValue(val);
    }
    this.blockCaching = false;
  }

  protected hasComponentChanged(attr: string, comp: IFormControlComponent): boolean {
    const currentValue = comp.getFormControl().value;
    const cache = this.formDataCache || this.initialDataCache;
    return (currentValue !== cache[attr]);
  }

  protected getCacheLastValue(attr: string): any {
    this.updateChangesStack(attr);
    let result = null;
    for (let i = this.valueChangesStack.length - 1; i >= 0; i--) {
      const current = this.valueChangesStack[i];
      if (current.attr === attr) {
        result = current.value;
        break;
      }
    }
    return result;
  }

  protected updateChangesStack(attr: string) {
    let index: number = undefined;
    for (let i = this.valueChangesStack.length - 1; i >= 0; i--) {
      const current = this.valueChangesStack[i];
      if (current.attr === attr) {
        index = i;
        break;
      }
    }
    if (index !== undefined) {
      for (let i = index; i >= 0; i--) {
        const prev = this.valueChangesStack[i - 1];
        const current = this.valueChangesStack[i];
        if (current.attr === attr) {
          this.valueChangesStack.splice(i, 1);
          if (!prev || prev.attr === attr) {
            continue;
          } else {
            break;
          }
        }
      }
    }
    if (this.valueChangesStack.length === 0) {
      this.onCacheEmptyStateChanges.emit(true);
    }
  }

  get isCacheStackEmpty(): boolean {
    return (this.valueChangesStack.length === 0);
  }

  isInitialStateChanged(): boolean {
    let currentCache;
    if (this.formDataCache) {
      currentCache = Object.assign({}, this.formDataCache);
      this.removeUndefinedProperties(currentCache);
    }

    let initialKeys = Object.keys(this.initialDataCache);
    let currentKeys = currentCache ? Object.keys(currentCache) : initialKeys;
    if (initialKeys.length !== currentKeys.length) {
      return true;
    }
    let res = false;
    for (let i = 0, len = initialKeys.length; i < len; i++) {
      let key = initialKeys[i];
      // TODO be careful with types comparisions
      res = (this.initialDataCache[key] !== currentCache[key]);
      if (res) {
        break;
      }
    }
    return res;
  }

  getChangedFormControlsAttr(): string[] {
    return this.changedFormControls;
  }
}
