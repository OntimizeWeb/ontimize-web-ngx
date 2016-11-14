import {
  MdContent,
  MdBackdrop,
  MdInk,
  MdPatternValidator, MdMaxLengthValidator,
  MdMinValueValidator, MdMaxValueValidator,
  MdNumberRequiredValidator,
  MdSubheader
} from '../components/material/ng2-material/index';

import {FormComponentDirective} from '../directives/FormComponentDirective';
import { OListItemDirective } from '../components/list/o-list-item.directive';
/*
* Just export minimum required directives of library ng2-material
* In the future, when @angular2-material is release candidate, this library will
* be removed.
*/
export const NG2_MATERIAL_DIRECTIVES = [
  MdContent,
  MdBackdrop,
  MdInk,
  MdPatternValidator, MdMaxLengthValidator,
  MdMinValueValidator, MdMaxValueValidator,
  MdNumberRequiredValidator,
  MdSubheader
];

export const ONTIMIZE_DIRECTIVES = [
  // ng-material directives
  ...NG2_MATERIAL_DIRECTIVES,

 //Ontimize directives...
  FormComponentDirective,
  OListItemDirective
];
