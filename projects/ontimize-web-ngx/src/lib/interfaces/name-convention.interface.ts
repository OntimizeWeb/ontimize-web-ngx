export interface INameConvention {

  parseColumnsToNameConventionForOntimize(columns: object | string): any[];

  parseColumnsToNameConventionForJSONAPI(columns: object | string): string;
  parseDataToNameConvention(data: any): any;
  parseValuesDataToNameConvention(data: any): any;
  parseFilterToNameConvention(filter: any): any;
  parseFilterExpresionNameConvention(filterExpresion: any): any;
  parseResultToNameConvention(data: any): any;
}
