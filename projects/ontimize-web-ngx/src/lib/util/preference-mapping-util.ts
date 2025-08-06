

export class OPreferenceMappingUtils {

  static readonly STANDARDREPORTMAPPING = {
    "ID": "PREFERENCEID",
    "NAME": "PREFERENCENAME",
    "DESCRIPTION": "PREFERENCEDESCRIPTION",
    "ENTITY": "PREFERENCEENTITY",
    "SERVICE": "PREFERENCESERVICE",
    "TYPE": "PREFERENCETYPE",
    "PREFERENCES": "PREFERENCEPREFERENCES"
  };

  static readonly STANDARDINSERTREPORTMAPPING = {
    "id": "preferenceid",
    "name": "preferencename",
    "description": "preferencedescription",
    "entity": "preferenceentity",
    "service": "preferenceservice",
    "type": "preferencetype",
    "params": "preferenceparameters"
  };

  static readonly STANDARDPARAMETERMAPPING = {
    "name": "reportParameterName",
    "description": "reportParameterDescription"
  };

  static readonly ONTIMIZEPARAMETERMAPPING = {
    "reportParameterName": "name",
    "reportParameterDescription": "description"
  };


  static readonly ONTIMIZEPREFERENCESMAPPING = {
    "preferenceid": "id",
    "preferencename": "name",
    "preferencedescription": "description",
    "preferenceentity": "entity",
    "preferenceservice": "service",
    "preferencetype": "type",
    "preferenceparameters": "params"
  };

  static readonly JSONAPIPREFERENCESMAPPING = {
    "preferenceid": "PREFERENCEID",
    "preferencename": "PREFERENCENAME",
    "preferencedescription": "PREFERENCEDESCRIPTION",
    "preferenceentity": "PREFERENCEENTITY",
    "preferenceservice": "PREFERENCESERVICE",
    "preferencetype": "PREFERENCETYPE",
    "preferenceparameters": "PREFERENCEPREFERENCES"
  };

  static transformKeys(data: string[], keyMapping: { [key: string]: string }): string[] {
    if (!Array.isArray(data)) {
      return data
    }
    return data.map((key) => keyMapping[key] || key);

  }

  /**
    * Transforma un objeto mapeando sus claves según el diccionario proporcionado.
    */

  private static mapObjectKeys(
    obj: any,
    keyMapping: { [key: string]: string },
    parameterKeyMapping?: { [key: string]: string }
  ): { [key: string]: any } {
    return Object.entries(obj).reduce<Record<string, any>>((newObj, [key, value]) => {
      const newKey = keyMapping[key] || key;

      if (Array.isArray(value) && value.every((item) => typeof item === "object" && !Array.isArray(item))) {
        // Transformar claves de objetos dentro de arrays
        newObj[newKey] = value.map((item) => this.mapObjectKeys(item, parameterKeyMapping || {}));
      } else if (typeof value === "object" && value !== null && newKey !== "params") {
        // Transformar claves de objetos anidados
        newObj[newKey] = this.mapObjectKeys(value, parameterKeyMapping || {});
      } else {
        newObj[newKey] = value;
      }

      return newObj;
    }, {});
  }


  /**
   * Transforma los datos, ya sea un solo objeto o un array de objetos, aplicando los mapeos de claves.
   */
  static transformData(data: { [key: string]: any } | { [key: string]: any }[], keyMapping: { [key: string]: string }, parameterKeyMapping?: { [key: string]: string }): { [key: string]: any }[] | { [key: string]: any } {
    if (Array.isArray(data)) {
      return data.map((obj) => this.mapObjectKeys(obj, keyMapping, parameterKeyMapping));
    } else if (typeof data === "object" && data !== null) {
      return this.mapObjectKeys(data, keyMapping, parameterKeyMapping);
    }
    return data;
  }

  static standarDataMapping(array: { [key: string]: any } | { [key: string]: any }[]): { [key: string]: any }[] | { [key: string]: any } {
    return OPreferenceMappingUtils.transformData(array, OPreferenceMappingUtils.STANDARDREPORTMAPPING, OPreferenceMappingUtils.STANDARDPARAMETERMAPPING);
  }

  static standarMappingKeys(array: string[]): string[] {
    return OPreferenceMappingUtils.transformKeys(array, OPreferenceMappingUtils.STANDARDREPORTMAPPING);
  }

  static ontimizePreferencesMappingKeys(array: string[]): string[] {
    return OPreferenceMappingUtils.transformKeys(array, OPreferenceMappingUtils.ONTIMIZEPREFERENCESMAPPING);
  }

  static ontimizePreferencesDataMapping(array: { [key: string]: any } | { [key: string]: any }[]): { [key: string]: any }[] | { [key: string]: any } {
    return OPreferenceMappingUtils.transformData(array, OPreferenceMappingUtils.ONTIMIZEPREFERENCESMAPPING, OPreferenceMappingUtils.ONTIMIZEPARAMETERMAPPING);
  }

  static jsonApiPreferencesMappingKeys(array: string[]): string[] {
    return OPreferenceMappingUtils.transformKeys(array, OPreferenceMappingUtils.JSONAPIPREFERENCESMAPPING);
  }

  static jsonApiPreferencesDataMapping(array: { [key: string]: any } | { [key: string]: any }[]): { [key: string]: any }[] | { [key: string]: any } {
    return OPreferenceMappingUtils.transformData(array, OPreferenceMappingUtils.JSONAPIPREFERENCESMAPPING);
  }




}
