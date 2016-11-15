import { Injectable } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { ObservableWrapper } from '../util/async';


@Injectable()
export class NavigationService {
  public currentTitle: string = null;
  public visible: boolean = true;

  private _titleEmitter: EventEmitter<any> = new EventEmitter();
  private _visibleEmitter: EventEmitter<Boolean> = new EventEmitter<Boolean>();
  private _sidenavEmitter: EventEmitter<any> = new EventEmitter();

  public setTitle(title: string): void {
    this.currentTitle = title;
    this._emitTitleChanged(this.currentTitle);
  }

  public setVisible(visible: boolean): void {
    this.visible = visible;
    this._emitVisibleChanged(this.visible);
  }

  public openSidenav() {
    this._emitOpenSidenav();
  }

  public closeSidenav() {
    this._emitCloseSidenav();
  }

  /**
 * Subscribe to title updates
 */
  public onTitleChange(onNext: (value: any) => void): Object {
    return ObservableWrapper.subscribe(this._titleEmitter, onNext);
  }

  public onVisibleChange(onNext: (value: boolean) => void): Object {
    return ObservableWrapper.subscribe(this._visibleEmitter, onNext);
  }

  public onSidenavChange(onNext: (value: any) => void): Object {
    return ObservableWrapper.subscribe(this._sidenavEmitter, onNext);
  }

  private _emitTitleChanged(title): void {
    ObservableWrapper.callEmit(this._titleEmitter, title);
  }

  private _emitVisibleChanged(visible): void {
    ObservableWrapper.callEmit(this._visibleEmitter, visible);
  }

  private _emitOpenSidenav() {
    ObservableWrapper.callEmit(this._sidenavEmitter, 'open');
  }

  private _emitCloseSidenav() {
    ObservableWrapper.callEmit(this._sidenavEmitter, 'close');
  }

  //* Provisional
  // protected move(index) {
  //   this.queryByIndex(index);
  // }

  // protected _setData(data) {
  //   if (Util.isArray(data) && data.length === 1) {
  //     this.navigationData = <Array<Object>>this.toFormValueData(data);
  //     this.syncCurrentIndex();
  //   } else {
  //     console.warn('Form has received not supported service data. Supported data are Array');
  //     this._updateFormData({});
  //   }
  // }

  // protected queryByIndex(index: number) {
  //   var self = this;
  //   this._query(index).subscribe(resp => {
  //     if (resp.code === 0) {
  //       let currentData = resp.data[0];
  //       self._updateFormData(self.toFormValueData(currentData));
  //       self._emitData(currentData);
  //     } else {
  //       console.log('error ');
  //     }
  //   }, err => {
  //     console.log(err);
  //   });
  // }

  //  _query(index): Observable<any> {
  //   var self = this;
  //   var loader = self.load();
  //   let filter = this.getKeysValues(index);
  //   let observable = this.dataService.query(filter, this.getAttributesToQuery(), this.entity);
  //   observable.subscribe(resp => {
  //     loader.unsubscribe();
  //   }, err => {
  //     console.log(err);
  //     loader.unsubscribe();
  //   });
  //   return observable;
  // }

  // protected syncCurrentIndex() {
  //   if (this.navigationData) {
  //     var self = this;
  //     let currKV = this.getCurrentKeysValues();
  //     if (currKV && Object.keys(currKV).length > 0) {
  //       let current = this.objectToFormValueData(currKV);
  //       this.navigationData.forEach((value: any, index: number) => {
  //         // check whether current === value
  //         let equals = false;
  //         Object.keys(current).forEach(function (key) {
  //           let pair = value[key];
  //           if (pair && pair.value) {
  //             if (current[key].value === pair.value.toString()) {
  //               equals = true;
  //             } else {
  //               equals = false;
  //             }
  //           }
  //         });
  //         if (equals) {
  //           self.currentIndex = index;
  //         }
  //       });
  //     }
  //   }
  // }

}
