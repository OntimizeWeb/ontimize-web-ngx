import { ApplicationRef, NgModuleRef } from '@angular/core';

export function ontimizePostBootstrap(ref: NgModuleRef<any> | ApplicationRef): NgModuleRef<any> | ApplicationRef {
  const loader: HTMLElement = document && document.getElementById('loader-wrapper');
  if (loader && loader.parentNode) {
    loader.parentNode.removeChild(loader);
  }
  return ref;
}
