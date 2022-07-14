export type FormLayoutInnerFormInfo = {
  modified: boolean;
  confirmOnExit: boolean;
}

export type FormLayoutDetailComponentData = {
  params: any;
  queryParams: any;
  urlSegments: any;
  id: string;
  component: any;
  label: string;
  innerFormsInfo: { [formAttr: string]: FormLayoutInnerFormInfo };
  url: string;
  rendered?: boolean;
  insertionMode?: boolean;
  formDataByLabelColumns?: any;
};

export type FormLayoutCloseDetailOptions = {
  exitWithoutConfirmation?: boolean;
}