/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Code copied from '@angular/core/src/facade/async of RC4. On RC5 this classes are removed!!
 */
import { EventEmitter } from '@angular/core';

export { Observable, Subject } from 'rxjs';

export function noop() {
  // nothing to do
}

export class ObservableWrapper {
  // TODO(vsavkin): when we use rxnext, try inferring the generic type from the first arg
  static subscribe<T>(
    emitter: any, onNext: (value: T) => void, onError?: (exception: any) => void,
    onComplete: () => void = () => {
      // nothing to do
    }): object {
    onError = (typeof onError === 'function') && onError || noop;
    onComplete = (typeof onComplete === 'function') && onComplete || noop;
    return emitter.subscribe({ next: onNext, error: onError, complete: onComplete });
  }

  static isObservable(obs: any): boolean { return !!obs.subscribe; }

  /**
   * Returns whether `obs` has any subscribers listening to events.
   */
  static hasSubscribers(obs: EventEmitter<any>): boolean { return obs.observers.length > 0; }

  static dispose(subscription: any) { subscription.unsubscribe(); }

  /**
   * @deprecated - use callEmit() instead
   */
  static callNext(emitter: EventEmitter<any>, value: any) { emitter.emit(value); }

  static callEmit(emitter: EventEmitter<any>, value: any) { emitter.emit(value); }

  static callError(emitter: EventEmitter<any>, error: any) { emitter.error(error); }

  static callComplete(emitter: EventEmitter<any>) { emitter.complete(); }

}

