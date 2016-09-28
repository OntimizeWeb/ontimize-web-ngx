import {Component} from '@angular/core';

const _reflect: any = Reflect;

export function OComponent(annotation : any) {
  return function (target: Function) {
    var parentTarget = Object.getPrototypeOf(target.prototype).constructor;
    var parentAnnotations = _reflect.getMetadata('annotations', parentTarget);
    var parentAnnotation = parentAnnotations[0];
    Object.keys(parentAnnotation).forEach(key => {
      if (isPresent(parentAnnotation[key])) {
        if (!isPresent(annotation[key])) {
          if (typeof annotation[key] === 'function') {
            annotation[key] = annotation[key].call(this, parentAnnotation[key]);
          } else {
            annotation[key] = parentAnnotation[key];
          }
        }
      }
      if (!isPresent(annotation[key])) {
        annotation[key] = parentAnnotation[key];
      }
    });
    var metadata = new Component(annotation);
    _reflect.defineMetadata('annotations', [ metadata ], target);
  };
}

function isPresent(obj) {
    return obj !== undefined && obj !== null;
}
