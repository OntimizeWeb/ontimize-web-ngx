import { INameConvention } from '../../interfaces/name-convention.interface';


export class NameConvention implements INameConvention {

  parseColumnsToNameConventionForOntimize(value: any): any[] {
    return Object.values(value);
  }

  parseColumnsToNameConventionForJSONAPI(value: any): string {
    return value;
  }

  parseDataToNameConvention(data: any): any {
    return data;
  }

  parseValuesDataToNameConvention(data: any): any {
    return data;
  }

  parseFilterExpresionNameConvention(data: any): any {
    return data;
  }
}
