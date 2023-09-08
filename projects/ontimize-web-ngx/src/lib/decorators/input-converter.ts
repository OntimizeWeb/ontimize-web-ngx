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

function createConverterIfNeeded(typeName: string, converter?: (value: any) => any) {
  if (converter != null) {
    return converter;
  }
  switch (typeName) {
    case 'String':
      return StringConverter;
    case 'Boolean':
      return BooleanConverter;
    case 'Number':
      return NumberConverter;
    default:
      return BooleanConverter;
  }
}

export function InputConverter(typeName?: string, converter?: (value: any) => any) {
  return (target: object, key: string | symbol) => {
    const stringKey = typeof key === 'string' ? key : key.toString();
    typeName = typeName || 'Boolean'; // Si no se proporciona, asumir como "Boolean"
    converter = createConverterIfNeeded(typeName, converter);

    const definition = Object.getOwnPropertyDescriptor(target, stringKey);

    Object.defineProperty(target, stringKey, {
      get: definition != null ? definition.get : function () {
        return this['__' + stringKey];
      },
      set: definition != null ?
        (newValue) => {
          definition.set(converter(newValue));
        } : function (newValue) {
          this['__' + stringKey] = converter(newValue);
        },
      enumerable: true,
      configurable: true
    });
  };
}
