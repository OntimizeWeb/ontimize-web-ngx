
import { Subscription } from 'rxjs';
import { EventEmitter } from '@angular/core';
import { IFormControlComponent, IFormDataComponent } from '../../o-form-data-component.class';
import { OFormComponent } from '../o-form.component';

export class OFormCacheClass {

  protected initialDataCache: Object = {};
  protected formDataCache: Object;
  protected valueChangesStack: Array<any> = [];
  protected _componentsSubscritpions: Array<Subscription> = [];
  protected blockCaching: boolean = false;
  protected initializedCache: boolean = false;

  protected formCacheSubscription: Subscription;
  onCacheEmptyStateChanges: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(protected form: OFormComponent) {
  }

  registerFormGroupListener() {
    /*
    * Keeping updated a cache of form data values
    */
    var self = this;
    this.formCacheSubscription = this.form.formGroup.valueChanges.subscribe((value: any) => {
      if (self.formDataCache === undefined) {
        // initialize cache
        self.formDataCache = {};
      }
      let cacheData = Object.assign({}, self.form.getRegisteredFieldsValues());
      cacheData = Object.assign(cacheData, value);
      self.form.ignoreFormCacheKeys.forEach(key => {
        delete cacheData[key];
      });
      Object.assign(self.formDataCache, cacheData);
    });
  }

  protected addChangeToStack(attr: string, comp: IFormControlComponent) {
    const currentValue = comp.getFormControl().value;
    const wasEmpty = this.valueChangesStack.length === 0;
    this.valueChangesStack.push({
      attr: attr,
      value: currentValue
    });
    if (wasEmpty) {
      this.onCacheEmptyStateChanges.emit(false);
    }
  }

  registerComponentCaching(attr: string, comp: IFormDataComponent) {
    const self = this;
    this._componentsSubscritpions[attr] = comp.getFormControl().valueChanges.subscribe(value => {
      // this._componentsSubscritpions[attr] = comp.onChange.subscribe(value => {
      if (self.initializedCache && !self.blockCaching && self.hasComponentChanged(attr, comp)) {
        self.addChangeToStack(attr, comp);
      }
    });
  }

  unregisterComponentCaching(attr: string) {
    if (this._componentsSubscritpions[attr]) {
      this._componentsSubscritpions[attr].unsubscribe();
      delete this._componentsSubscritpions[attr];
    }
  }

  getCachedValue(attr: string): any {
    if (this.formDataCache && this.formDataCache.hasOwnProperty(attr)) {
      return this.formDataCache[attr];
    }
    return undefined;
  }

  destroy() {
    if (this.formCacheSubscription) {
      this.formCacheSubscription.unsubscribe();
    }
    this.formDataCache = undefined;
  }

  initializeCache(val: any) {
    this.initialDataCache = val;
    this.valueChangesStack = [];
    this.onCacheEmptyStateChanges.emit(true);
    this.initializedCache = true;
  }

  getInitialDataCache() {
    return this.initialDataCache;
  }

  getDataCache() {
    return this.formDataCache;
  }

  restartCache() {
    this.formDataCache = {};
    this.initializeCache({});
  }

  setCacheSnapshot() {
    this.initializeCache(this.getDataCache());
  }

  undoLastChange(options?) {
    options = (options || {});
    //removing last element because it is the last changed value
    // const lastElement = this.valueChangesStack.pop();
    var lastElement = this.valueChangesStack[this.valueChangesStack.length - 1];
    // && !options.keyboardEvent
    if (lastElement) {
      const lastCacheValue = this.getCacheLastValue(lastElement.attr);
      const lastValue = (lastCacheValue !== null) ? lastCacheValue : this.initialDataCache[lastElement.attr];
      this.setFormControlValue(lastElement.attr, lastValue);
    }
  }

  protected setFormControlValue(attr: string, val: any) {
    this.blockCaching = true;
    let formControl = this.form.formGroup.get(attr);
    if (formControl) {
      formControl.setValue(val);
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
    let res = false;
    let initialKeys = Object.keys(this.initialDataCache);
    let currentKeys = initialKeys;
    let currentCache = this.formDataCache;
    if (this.formDataCache) {
      currentCache = Object.assign({}, this.formDataCache);
      Object.keys(currentCache).forEach(key => {
        if (currentCache[key] === undefined) {
          delete currentCache[key];
        }
      });
      currentKeys = Object.keys(currentCache);
    }
    if (initialKeys.length !== currentKeys.length) {
      return true;
    }
    for (let i = 0, leni = initialKeys.length; i < leni; i++) {
      let key = initialKeys[i];
      // TODO be careful with types comparisions
      res = (this.initialDataCache[key] !== currentCache[key]);
      if (res) {
        break;
      }
    }
    return res;
  }

}
