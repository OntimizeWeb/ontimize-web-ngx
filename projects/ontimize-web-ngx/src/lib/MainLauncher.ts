import { NgModuleRef } from '@angular/core';

export function ontimizePostBootstrap(ngModuleRef: NgModuleRef<any>): NgModuleRef<any> {
  const loader: HTMLElement = document && document.getElementById('loader-wrapper');
  if (loader && loader.parentNode) {
    loader.parentNode.removeChild(loader);
  }
  return ngModuleRef;
}
