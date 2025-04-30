import { InjectionToken, Injector } from '@angular/core';

/**
 * Returns the value for the provided injection token
 * @param token the injection token
 * @param injector the injector
 */
export function _getInjectionTokenValue<T>(token: InjectionToken<T>, injector: Injector): T {
  let service: T;
  try {
    service = injector.get(token);
  } catch (e) {
    // No value provided for the injection token
    return null;
  }
  return service;
}
