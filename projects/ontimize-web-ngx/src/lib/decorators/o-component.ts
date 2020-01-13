import { Component } from '@angular/core';
import 'reflect-metadata';

export function OComponent(newCompAnnotations: any) {

  function OComponentInner(target: Function) {
    var parentTarget = Object.getPrototypeOf(target.prototype).constructor;
    var parentAnnotations = Reflect.getMetadata('annotations', parentTarget);
    if (parentAnnotations) {
      var parentAnnotation = parentAnnotations[0];
      copyDecorators(newCompAnnotations, parentAnnotation);
    } else if (parentTarget.hasOwnProperty('decorators')) {
      var parentDecorators = getDecorators(parentTarget);
      copyDecorators(newCompAnnotations, parentDecorators);
    }
    var metadata = new Component(newCompAnnotations);
    Reflect.defineMetadata('annotations', [metadata], target);
  }
  return OComponentInner;
}

function isPresent(obj) {
  return obj !== undefined && obj !== null;
}

function getDecorators(target: any) {
  let decoratorsObj = undefined;
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
