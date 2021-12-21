import { Util } from './util';

describe('Util => parseBoolean', () => {

  it('"yes" return true', () => {
    expect(Util.parseBoolean('yes')).toEqual(true);
  });
  it('"true" return true', () => {
    expect(Util.parseBoolean('true')).toEqual(true);
  });

  it('"no" return false', () => {
    expect(Util.parseBoolean('no')).toEqual(false);
  });
  it('"false" return false', () => {
    expect(Util.parseBoolean('false')).toEqual(false);
  });

  it('invalid value return false', () => {
    expect(Util.parseBoolean('xxx')).toEqual(false);
  });
  it('invalid value using defaultValue return defaultValue', () => {
    expect(Util.parseBoolean('xxx', true)).toEqual(true);
  });

});

describe('Util => parseArray', () => {

  let empty: string = '';
  let arrayData: string = 'one;two;three;three;;';

  it('empty array', () => {
    expect(Util.parseArray(empty)).toEqual([]);
  });

  it('array with repeated elements', () => {
    expect(Util.parseArray(arrayData)).toEqual(['one', 'two', 'three', 'three', '', '']);
  });

  it('array without repeated elements', () => {
    expect(Util.parseArray(arrayData, true)).toEqual(['one', 'two', 'three', '']);
  });

});
