import {
  MdContent,
  MdPatternValidator, MdMaxLengthValidator,
  MdMinValueValidator, MdMaxValueValidator,
  MdNumberRequiredValidator,
} from '../components/material/ng2-material/index';

import {FormComponentDirective} from '../directives/FormComponentDirective';
/*
* Just export minimum required directives of library ng2-material
* In the future, when @angular2-material is release candidate, this library will
* be removed.
*/
export const NG2_MATERIAL_DIRECTIVES = [
  MdContent,
  MdPatternValidator, MdMaxLengthValidator,
  MdMinValueValidator, MdMaxValueValidator,
  MdNumberRequiredValidator
];

export const ONTIMIZE_DIRECTIVES = [
  // ng-material directives
  ...NG2_MATERIAL_DIRECTIVES,

 //Ontimize directives...
  FormComponentDirective
];
