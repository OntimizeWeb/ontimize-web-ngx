export interface INameConvention {

  parseColumnsToNameConventionForOntimize(value: object | string);
  parseColumnsToNameConventionForJSONAPI(value: object | string);

  parseDataToNameConvention(data: any): any;

  parseValuesDataToNameConvention(data: any): any;

  parseFilterExpresionNameConvention(data: any): any;
}
