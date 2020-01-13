import { Util } from './util';

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
