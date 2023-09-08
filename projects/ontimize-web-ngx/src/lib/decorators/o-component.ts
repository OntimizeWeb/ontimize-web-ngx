import { Component } from '@angular/core';

export function OComponent(newCompAnnotations: any) {

  function OComponentInner(target: Function) {
    const parentTarget = Object.getPrototypeOf(target.prototype).constructor;
    const parentAnnotations = getAnnotations(parentTarget);
    if (parentAnnotations) {
      const parentAnnotation = parentAnnotations[0];
      copyDecorators(newCompAnnotations, parentAnnotation);
    } else if (parentTarget.hasOwnProperty('decorators')) {
      const parentDecorators = getDecorators(parentTarget);
      copyDecorators(newCompAnnotations, parentDecorators);
    }
    const metadata = new Component(newCompAnnotations);
    setAnnotations(target, [metadata]);
  }
  return OComponentInner;
}

function isPresent(obj) {
  return obj !== undefined && obj !== null;
}

function getAnnotations(target: any) {
  return target['__annotations__'];
}

function setAnnotations(target: any, annotations: any[]) {
  target['__annotations__'] = annotations;
}

function getDecorators(target: any) {
  let decoratorsObj;
  const decorators = target.decorators[0];
  if (decorators && decorators.args && decorators.args[0]) {
    decoratorsObj = decorators.args[0];
  }
  return decoratorsObj;
}

function copyDecorators(newComp: any, parent: any) {
  Object.keys(parent).forEach(key => {
    if (isPresent(parent[key])) {
      if (!isPresent(newComp[key])) {
        if (typeof newComp[key] === 'function') {
          newComp[key] = newComp[key].call(this, parent[key]);
        } else {
          newComp[key] = parent[key];
        }
      }
    }
    if (!isPresent(newComp[key])) {
      newComp[key] = parent[key];
    }
  });
}
