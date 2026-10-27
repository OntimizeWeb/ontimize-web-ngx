import { DefaultOTableDataSource } from './default-o-table.datasource';

describe('DefaultOTableDataSource => quick filter', () => {

  const createColumn = (attr: string, options: { searching?: boolean, filterFunction?: (cellValue: any, rowValue: any, quickFilter?: string) => boolean } = {}) => {
    const searching = options.searching !== false;
    return {
      attr,
      renderer: options.filterFunction ? { filterFunction: options.filterFunction } : undefined,
      useQuickfilterFunction: () => searching && !options.filterFunction,
      useCustomFilterFunction: () => searching && !!options.filterFunction,
      getFilterValue: (cellValue: any) => [cellValue]
    };
  };

  const createDataSource = (columns: any[], filterCaseSensitive: boolean = false): DefaultOTableDataSource => {
    const tableOptions = { columns, filterCaseSensitive };
    const table: any = {
      injector: { get: () => ({}) },
      oTableOptions: tableOptions,
      sort: undefined
    };
    return new DefaultOTableDataSource(table);
  };

  const filterNames = (dataSource: DefaultOTableDataSource, quickFilter: string, data: any[]): string[] => {
    dataSource.quickFilter = quickFilter;
    return dataSource.getQuickFilterData(data).map(row => row.NAME);
  };

  const data = [
    { NAME: 'Ángel', CITY: 'Vigo' },
    { NAME: 'Jose', CITY: 'A Coruña' },
    { NAME: 'Óscar', CITY: 'Ourense' },
    { NAME: 'Zoe', CITY: 'Lugo' }
  ];

  it('ignores accents in the cell values', () => {
    const dataSource = createDataSource([createColumn('NAME'), createColumn('CITY')]);
    expect(filterNames(dataSource, 'angel', data)).toEqual(['Ángel']);
    expect(filterNames(dataSource, 'osc', data)).toEqual(['Óscar']);
  });

  it('ignores accents in the quick filter value', () => {
    const dataSource = createDataSource([createColumn('NAME'), createColumn('CITY')]);
    expect(filterNames(dataSource, 'josé', data)).toEqual(['Jose']);
    expect(filterNames(dataSource, 'ÓSCAR', data)).toEqual(['Óscar']);
  });

  it('ignores accents in values with other diacritics such as ñ', () => {
    const dataSource = createDataSource([createColumn('NAME'), createColumn('CITY')]);
    expect(filterNames(dataSource, 'coruna', data)).toEqual(['Jose']);
  });

  it('returns no rows when nothing matches', () => {
    const dataSource = createDataSource([createColumn('NAME'), createColumn('CITY')]);
    expect(filterNames(dataSource, 'madrid', data)).toEqual([]);
  });

  it('returns all rows when the quick filter is empty', () => {
    const dataSource = createDataSource([createColumn('NAME')]);
    expect(filterNames(dataSource, '', data)).toEqual(['Ángel', 'Jose', 'Óscar', 'Zoe']);
  });

  it('ignores accents but respects case when filter-case-sensitive is enabled', () => {
    const dataSource = createDataSource([createColumn('NAME')], true);
    expect(filterNames(dataSource, 'Angel', data)).toEqual(['Ángel']);
    expect(filterNames(dataSource, 'angel', data)).toEqual([]);
  });

  it('does not search in columns that are not searchable', () => {
    const dataSource = createDataSource([createColumn('NAME'), createColumn('CITY', { searching: false })]);
    expect(filterNames(dataSource, 'vigo', data)).toEqual([]);
  });

  it('keeps using the custom filter function of the column renderer', () => {
    const filterFunction = jasmine.createSpy('filterFunction').and.callFake((cellValue: any) => cellValue === 'Zoe');
    const dataSource = createDataSource([createColumn('NAME', { filterFunction })]);
    expect(filterNames(dataSource, 'anything', data)).toEqual(['Zoe']);
    expect(filterFunction).toHaveBeenCalledWith('Zoe', data[3], 'anything');
  });

});
