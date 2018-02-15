import { OFormComponent } from './form/o-form.component';

export class ServiceUtils {

  static getParentItemFromForm(parentItem: any, parentKeysObject: Object, form: OFormComponent) {
    let result = parentItem;
    const parentKeys = Object.keys(parentKeysObject || {});
    const formComponents = form ? form.getComponents() : {};

    if (parentKeys && parentKeys.length > 0 && parentItem === undefined && (Object.keys(formComponents).length > 0)) {
      let partialResult = {};
      parentKeys.forEach(key => {
        const formFieldAttr = parentKeysObject[key];
        if (formComponents.hasOwnProperty(formFieldAttr)) {
          let currentData = formComponents[formFieldAttr].getValue();
          switch (typeof (currentData)) {
            case 'string':
              if (currentData.trim().length > 0) {
                partialResult[key] = currentData.trim();
              }
              break;
            case 'number':
              if (!isNaN(currentData)) {
                partialResult[key] = currentData;
              }
              break;
          }
        }
      });
      if (Object.keys(partialResult).length > 0) {
        result = partialResult;
      }
    }
    return result;
  }
}
