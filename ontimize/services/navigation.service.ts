import {Injectable} from '@angular/core';
import {EventEmitter} from '@angular/core';
import {ObservableWrapper} from '../util/async';
import {IComponentMeta, INavigationLink} from '../interfaces';



@Injectable()
export class NavigationService {
  public currentTitle: string = null;
  public visible: boolean = true;
  public nextLink: INavigationLink = null;
  public prevLink: INavigationLink = null;

  private _titleEmitter: EventEmitter<any> = new EventEmitter();
  private _visibleEmitter: EventEmitter<any> = new EventEmitter();
  private _sidenavEmitter: EventEmitter<any> = new EventEmitter();

  componentLink(comp: IComponentMeta): INavigationLink {
    return {
      brief: comp.name,
      routeLink: [comp.path, { id: comp.id }]
    };
  }

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

  public onVisibleChange(onNext: (value: any) => void): Object {
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
}
