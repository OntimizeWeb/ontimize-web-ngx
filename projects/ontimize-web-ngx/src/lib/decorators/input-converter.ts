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
  if (value == null || typeof value === 'number') {
    return value;
  }
  return parseFloat(value.toString());
}

function createConverterIfNeeded(metadata: any, converter?: (value: any) => any) {
  if (converter != null) {
    return converter;
  }
  switch (metadata.name) {
    case 'String':
      converter = StringConverter;
      break;
    case 'Boolean':
      converter = BooleanConverter;
      break;
    case 'Number':
      converter = NumberConverter;
      break;
  }
  return converter;
}

export function InputConverter(converter?: (value: any) => any) {

  return (target: object, key: string | symbol) => {
    const metadata = (Reflect as any).getMetadata('design:type', target, key);
    if (metadata == null) {
      throw new Error('The reflection metadata could not be found.');
    }
    converter = createConverterIfNeeded(metadata, converter);
    if (converter == null) {
      throw new Error('There is no converter for the given property type "' + metadata.name + '".');
    }

    const stringKey = typeof key === 'string' ? key : key.toString();
    const definition = Object.getOwnPropertyDescriptor(target, key);

    Object.defineProperty(target, key, {
      // tslint:disable-next-line:space-before-function-paren
      get: definition != null ? definition.get : function () {
        return this['__' + stringKey];
      },
      set: definition != null ?
        (newValue) => {
          definition.set(converter(newValue));
          // tslint:disable-next-line:space-before-function-paren
        } : function (newValue) {
          this['__' + stringKey] = converter(newValue);
        },
      enumerable: true,
      configurable: true
    });
  };
}
