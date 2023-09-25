import { EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';

import { IFormControlComponent } from '../../../interfaces/form-control-component.interface';
import { IFormDataComponent } from '../../../interfaces/form-data-component.interface';
import { Util } from '../../../util/util';
import { OFormComponent } from '../o-form.component';

export class OFormCacheClass {

  protected initialDataCache: object = {};
  protected formDataCache: object;
  protected valueChangesStack: Array<any> = [];
  protected _componentsSubscritpions: any = {};
  protected blockCaching: boolean = false;
  protected initializedCache: boolean = false;

  onCacheStateChanges: EventEmitter<any> = new EventEmitter<any>();

  protected changedFormControls: string[] = [];

  constructor(protected form: OFormComponent) {
  }

  protected updateFormDataCache() {
    this.formDataCache = this.form.getRegisteredFieldsValues();
  }

  protected addChangeToStack(comp: IFormControlComponent) {
    const currentValue = comp.getFormControl().value;
    this.valueChangesStack.push({
      attr: comp.getAttribute(),
      value: currentValue
    });
    this.onCacheStateChanges.emit();
  }

  protected registerComponentCaching(comp: IFormDataComponent) {
    const attr = comp.getAttribute();
    const listenTo = this.form.detectChangesOnBlur ? comp.onValueChange : comp.onChange;
    if (!Util.isDefined(listenTo)) {
      return;
    }
    this._componentsSubscritpions[attr] = listenTo.subscribe(() => {
      if (this.initializedCache && !this.blockCaching && this.hasComponentChanged(attr, comp)) {
        if (this.changedFormControls.indexOf(attr) === -1) {
          this.changedFormControls.push(attr);
        }
        this.updateFormDataCache();
        this.addChangeToStack(comp);
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
    const initialCache = this.form.getRegisteredFieldsValues();
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
    this.onCacheStateChanges.emit();
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

  undoLastChange() {
    const lastElement = this.valueChangesStack[this.valueChangesStack.length - 1];
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
    let index: number;
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
      this.onCacheStateChanges.emit();
    }
  }

  get isCacheStackEmpty(): boolean {
    return (this.valueChangesStack.length === 0);
  }

  isInitialStateChanged(ignoreAttrs: string[] = []): boolean {
    const initialCache = Object.assign({}, this.initialDataCache);
    let currentCache: object;
    if (this.formDataCache) {
      currentCache = Object.assign({}, this.formDataCache);
      this.removeUndefinedProperties(currentCache);
    } else {
      return false;
    }

    let initialKeys = Object.keys(initialCache);
    let currentKeys = currentCache ? Object.keys(currentCache) : initialKeys;

    // Remove ignored fields from temporary initial cache data
    if (ignoreAttrs.length) {
      initialKeys = initialKeys.filter(key => !ignoreAttrs.includes(key));
      currentKeys = currentKeys.filter(key => !ignoreAttrs.includes(key));
      ignoreAttrs.forEach(key => delete initialCache[key]);
    }

    if (currentKeys.length === 0) {
      return false;
    }

    if (initialKeys.length !== currentKeys.length) {
      return true;
    }
    // Remove ignored fields from temporary initial cache data
    if (ignoreAttrs.length) {
      initialKeys = initialKeys.filter(key => !ignoreAttrs.includes(key));
      ignoreAttrs.forEach(key => delete initialCache[key]);
    }

    let res = false;
    for (let i = 0, len = initialKeys.length; i < len; i++) {
      const key = initialKeys[i];
      // TODO be careful with types comparisions
      res = (initialCache[key] !== currentCache[key]);
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
