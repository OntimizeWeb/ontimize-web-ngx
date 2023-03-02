import { OListItemDirective } from '../components/list/list-item/o-list-item.directive';
import { OKeyboardListenerDirective } from '../directives/keyboard-listener.directive';
import { OLockerDirective } from '../directives/locker.directive';
import { OFileDragAndDropDirective } from '../directives/o-file-drag-and-drop.directive';
import { OHiddenDirective } from '../directives/o-hidden.directive';
import { OMatErrorDirective } from '../directives/o-mat-error.directive';
import { OMatPrefix } from '../directives/o-mat-prefix.directive';
import { OMatSuffix } from '../directives/o-mat-suffix.directive';
import { OTabGroupDirective } from '../directives/o-tab-group.directive';

export const ONTIMIZE_DIRECTIVES = [
  // Ontimize directives...
  OKeyboardListenerDirective,
  OListItemDirective,
  OTabGroupDirective,
  OLockerDirective,
  OHiddenDirective,
  OMatErrorDirective,
  OFileDragAndDropDirective,
  OMatPrefix,
  OMatSuffix
];
