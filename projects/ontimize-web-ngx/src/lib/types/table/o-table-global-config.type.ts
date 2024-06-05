import { debounceTime } from 'rxjs/operators';
import { ORowHeight, OTableDetailMode, OTableEditionMode } from './../../util/codes';
export type OTableGlobalConfig = {
  autoAdjust: boolean;
  autoAlignTitles: boolean;
  filterColumnActiveByDefault: boolean;
  editionMode: OTableEditionMode;
  detailMode: OTableDetailMode;
  rowHeight: ORowHeight
}
