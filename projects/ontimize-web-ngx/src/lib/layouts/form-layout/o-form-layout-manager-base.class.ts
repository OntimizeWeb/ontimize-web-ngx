import { OFormLayoutManagerComponentStateClass } from "../../services/state/o-form-layout-manager-component-state.class";
import { FormLayoutCloseDetailOptions, FormLayoutDetailComponentData } from "../../types/form-layout-detail-component-data.type";

export abstract class OFormLayoutManagerBase {
  state: OFormLayoutManagerComponentStateClass;
  abstract getLabelFromData(data: any): string;
  abstract getLabelFromUrlParams(urlParams: object): string;
  abstract getFormDataFromLabelColumns(data: any);
  abstract setAsActiveFormLayoutManager();
  abstract hasToConfirmExit(data: FormLayoutDetailComponentData, options?: FormLayoutCloseDetailOptions): boolean
  abstract updateIfNeeded(): boolean;

}