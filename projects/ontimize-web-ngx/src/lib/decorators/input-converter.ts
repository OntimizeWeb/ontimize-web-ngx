import { coerceNumberProperty } from "@angular/cdk/coercion";

export function StringConverter(value: any) {
  if (value == null || typeof value === 'string') {
    return value;
  }
  return value.toString();
}

export function BooleanConverter(value: any) {
  if (value == null || typeof value === 'boolean') {
    return value;
  }
  return value.toString() === 'true' || value.toString() === 'yes';
}

export function NumberConverter(value: any) {
  return coerceNumberProperty(value);
}

export function BooleanInputConverter() {
  return function decorator(target: unknown, propertyKey: PropertyKey): any {
    const privateFieldName = `_${String(propertyKey)}`
    Object.defineProperty(target, privateFieldName, {
      configurable: true,
      writable: true,
    })
    return {
      get() {
        return this[privateFieldName]
      },
      set(value: unknown) {
        this[privateFieldName] = BooleanConverter(value);
      },
    }
  }
}
export function NumberInputConverter() {
  return function decorator(target: unknown, propertyKey: PropertyKey): any {
    const privateFieldName = `_${String(propertyKey)}`
    Object.defineProperty(target, privateFieldName, {
      configurable: true,
      writable: true,
    })
    return {
      get() {
        return this[privateFieldName]
      },
      set(value: unknown) {
        this[privateFieldName] = NumberConverter(value);
      },
    }
  }
}