export interface INameConvention {

  parseColumnsToNameConventionForOntimize(value: object | string);
  parseColumnsToNameConventionForJSONAPI(value: object | string);

  parseDataToNameConvention(data: any): any;

  parseValuesDataToNameConvention(data: any): any;

  parseFilterExpresionNameConvention(data: any): any;
  /**
   *
   * @param data
   * @returns result to name convention,
   *  if nameConvention is uppercase return result keys in lowercase
   *  if nameConvention is lowercase return result keys in uppercase
   */
  parseResultToNameConvention(data: any): any;
}
