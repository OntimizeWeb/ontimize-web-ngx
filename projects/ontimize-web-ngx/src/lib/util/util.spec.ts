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

describe('Util => sortFunction', () => {

  const sortValues = (values: any[], direction: string) => [...values].sort((a, b) => Util.sortFunction(a, b, direction));

  it('sorts accented words next to their base letter in ascending order', () => {
    expect(sortValues(['Zoe', 'Óscar', 'Ángel', 'Bea', 'alba', 'Pablo'], 'asc'))
      .toEqual(['alba', 'Ángel', 'Bea', 'Óscar', 'Pablo', 'Zoe']);
  });

  it('sorts accented words next to their base letter in descending order', () => {
    expect(sortValues(['Zoe', 'Óscar', 'Ángel', 'Bea', 'alba', 'Pablo'], 'desc'))
      .toEqual(['Zoe', 'Pablo', 'Óscar', 'Bea', 'Ángel', 'alba']);
  });

  it('places the unaccented word before the accented one when they only differ by the accent', () => {
    expect(sortValues(['José', 'Jose'], 'asc')).toEqual(['Jose', 'José']);
  });

  it('ignores case when comparing strings', () => {
    expect(Util.sortFunction('abc', 'ABC', 'asc')).toBe(0);
    expect(sortValues(['b', 'A', 'C'], 'asc')).toEqual(['A', 'b', 'C']);
  });

  it('sorts numeric values numerically', () => {
    expect(sortValues([10, '9', 100, 2], 'asc')).toEqual([2, '9', 10, 100]);
    expect(sortValues([10, '9', 100, 2], 'desc')).toEqual([100, 10, '9', 2]);
  });

  it('places null values first in ascending order', () => {
    expect(sortValues(['beta', null, 'alfa'], 'asc')).toEqual([null, 'alfa', 'beta']);
  });

});
