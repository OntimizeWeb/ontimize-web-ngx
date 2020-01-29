export function StringConverter(value: any) {
  if (value === null || value === undefined || typeof value === 'string') {
    return value;
  }
  return value.toString();
}

export function BooleanConverter(value: any) {
  if (value === null || value === undefined || typeof value === 'boolean') {
    return value;
  }
  return value.toString() === 'true' || value.toString() === 'yes';
}

export function NumberConverter(value: any) {
  if (value === null || value === undefined || typeof value === 'number') {
    return value;
  }
  return parseFloat(value.toString());
}

export function InputConverter(converter?: Function) {
  function InputConverterInner(target: Object, key: string) {
    if (converter === undefined) {
      const metadata = (<any>Reflect).getMetadata('design:type', target, key);
      if (metadata === undefined || metadata === null) {
        throw new Error('The reflection metadata could not be found.');
      }
      if (metadata.name === 'String') {
        converter = StringConverter;
      } else if (metadata.name === 'Boolean') {
        converter = BooleanConverter;
      } else if (metadata.name === 'Number') {
        converter = NumberConverter;
      } else {
        throw new Error('There is no converter for the given property type "' + metadata.name + '".');
      }
    }

    const definition = Object.getOwnPropertyDescriptor(target, key);
    if (definition) {
      Object.defineProperty(target, key, {
        get: definition.get,
        set: newValue => {
          definition.set(converter(newValue));
        },
        enumerable: true,
        configurable: true
      });
    } else {
      Object.defineProperty(target, key, {
        get: () => {
          return target['__' + key];
        },
        set: (newValue) => {
          target['__' + key] = converter(newValue);
        },
        enumerable: true,
        configurable: true
      });
    }
  }
  return InputConverterInner;
}
