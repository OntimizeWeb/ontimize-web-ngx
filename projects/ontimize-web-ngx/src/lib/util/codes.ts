export type OAppLayoutMode = 'mobile' | 'desktop';
export type OSidenavMode = 'over' | 'push' | 'side';
export type CHANGE_EVENTS = 'onValueChange' | 'onChange';

export class Codes {

  public static readonly PAGINATED_QUERY_METHOD = 'advancedQuery';
  public static readonly DELETE_METHOD = 'delete';
  public static readonly INSERT_METHOD = 'insert';
  public static readonly UPDATE_METHOD = 'update';
  public static readonly QUERY_METHOD = 'query';
  public static readonly QUERYBYID_METHOD = 'queryById';

  public static DEFAULT_QUERY_ROWS = 10;
  public static PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

  public static DETAIL_ICON = 'chevron_right';
  public static EDIT_ICON = 'mode_edit';

  public static DEFAULT_ROW_HEIGHT = 'medium';
  public static AVAILABLE_ROW_HEIGHTS_VALUES = ['small', 'medium', 'large'];

  public static DETAIL_MODE_NONE = 'none';
  public static DETAIL_MODE_CLICK = 'click';
  public static DETAIL_MODE_DBLCLICK_VALUES = ['dblclick', 'doubleclick'];

  public static EDITION_MODE_NONE = 'none';
  public static EDITION_MODE_CLICK = 'click';
  public static EDITION_MODE_DBLCLICK_VALUES = ['dblclick', 'doubleclick'];

  public static SELECTION_MODE_NONE = 'none';
  public static SELECTION_MODE_SINGLE = 'single';
  public static SELECTION_MODE_MULTIPLE = 'multiple';

  public static EXPORT_MODE_VISIBLE = 'visible';
  public static EXPORT_MODE_LOCAL = 'local';
  public static EXPORT_MODE_ALL = 'all';

  public static HYPHEN_SEPARATOR = '-';
  public static SPACE_SEPARATOR = ' ';
  public static COLUMNS_ALIAS_SEPARATOR = ':';
  public static ARRAY_INPUT_SEPARATOR = ';';
  public static TYPE_SEPARATOR = ':';
  public static VALUES_SEPARATOR = '=';
  public static ASC_SORT = 'asc';
  public static DESC_SORT = 'desc';

  public static TYPE_INT = 'int';

  public static ROUTE_SEPARATOR = '/';
  public static ROUTE_VARIABLE_CHAR = ':';

  public static PARENT_KEYS_KEY = 'pk';
  public static QUERY_PARAMS = 'queryParams';
  public static IS_DETAIL = 'isdetail';

  public static LANGUAGE_KEY = 'lang';
  public static SESSION_KEY = 'session';
  public static SESSION_EXPIRED_KEY = 'session-expired';

  public static LOGIN_ROUTE = '/login';
  public static FORBIDDEN_ROUTE = '403';
  public static DEFAULT_EDIT_ROUTE = 'edit';
  public static DEFAULT_DETAIL_ROUTE = undefined;
  public static DEFAULT_INSERT_ROUTE = 'new';

  public static IGNORE_CAN_DEACTIVATE = 'ignore_can_deactivate';
  public static INSERTION_MODE = 'insertionMode';

  public static ONTIMIZE_SUCCESSFUL_CODE = 0;
  public static ONTIMIZE_FAILED_CODE = 1;
  public static ONTIMIZE_UNAUTHORIZED_CODE = 3;

  public static ICON_POSITION_LEFT = 'left';
  public static ICON_POSITION_RIGHT = 'right';

  public static COLUMN_TITLE_ALIGN_START = 'start';
  public static COLUMN_TITLE_ALIGN_CENTER = 'center';
  public static COLUMN_TITLE_ALIGN_END = 'end';
  public static COLUMN_TITLE_ALIGN_AUTO = 'auto';
  public static AVAILABLE_COLUMN_TITLE_ALIGNS =
    [Codes.COLUMN_TITLE_ALIGN_START, Codes.COLUMN_TITLE_ALIGN_CENTER, Codes.COLUMN_TITLE_ALIGN_END, Codes.COLUMN_TITLE_ALIGN_AUTO];

  public static O_MAT_ERROR_STANDARD = 'standard';
  public static O_MAT_ERROR_LITE = 'lite';

  public static O_INPUTS_OPTIONS_COLOR_ACCENT = 'accent';
  public static HourFormat = {
    TWELVE: 'hh:mm a',
    TWENTY_FOUR: 'HH:mm a',
  };

  // OFormComponent
  public static CLOSE_DETAIL_ACTION: string = 'CLOSE';
  public static BACK_ACTION: string = 'BACK';
  public static RELOAD_ACTION: string = 'RELOAD';
  public static GO_EDIT_ACTION: string = 'GO_EDIT';
  public static EDIT_ACTION: string = 'EDIT';
  public static INSERT_ACTION: string = 'INSERT';
  public static GO_INSERT_ACTION: string = 'GO_INSERT';
  public static DELETE_ACTION: string = 'DELETE';
  public static UNDO_LAST_CHANGE_ACTION: string = 'UNDO_LAST_CHANGE';

  // OTableComponent
  public static DEFAULT_COLUMN_MIN_WIDTH = 80;
  public static NAME_COLUMN_SELECT = 'select';
  public static NAME_COLUMN_EXPANDABLE = 'expandable';
  public static SUFFIX_COLUMN_INSERTABLE = '_insertable';
  public static LIMIT_SCROLLVIRTUAL = 50;

  public static TWENTY_FOUR_HOUR_FORMAT = 24;
  public static TWELVE_FOUR_HOUR_FORMAT = 12;

  public static OAppLayoutModes: OAppLayoutMode[] = ['mobile', 'desktop'];
  public static OSidenavModes: OSidenavMode[] = ['over', 'push', 'side'];

  public static OAppLayoutMode = ['mobile', 'desktop'];
  public static OSidenavMode = ['over', 'push', 'side'];

  public static APP_LAYOUT_MODE_DESKTOP: OAppLayoutMode = 'desktop';
  public static APP_LAYOUT_MODE_MOBILE: OAppLayoutMode = 'mobile';
  public static VISIBLE_EXPORT_BUTTONS: string[] = ['xlsx', 'pdf', 'html'];
  public static VISIBLE_EXPORT_BUTTONS3X: string[] = ['xlsx', 'pdf', 'csv'];

  public static DEFAULT_CHANGE_EVENT: CHANGE_EVENTS = 'onValueChange';
  public static TYPES_DATE_GROUPS = ["YEAR", "MONTH", "YEAR_MONTH", "YEAR_MONTH_DAY"];

  static isDoubleClickMode(value: string): boolean {
    return Codes.DETAIL_MODE_DBLCLICK_VALUES.indexOf(value) !== -1;
  }

  static isValidRowHeight(value: string): boolean {
    return Codes.AVAILABLE_ROW_HEIGHTS_VALUES.indexOf(value) !== -1;
  }

  static getIsDetailObject(): any {
    const res = {};
    res[Codes.IS_DETAIL] = 'true';
    return res;
  }

  static formatString(format: number) {
    return (format === Codes.TWENTY_FOUR_HOUR_FORMAT ? Codes.HourFormat.TWENTY_FOUR : Codes.HourFormat.TWELVE);
  }

  static isHourInputAllowed(e: KeyboardEvent): boolean {
    // Allow: backspace, delete, tab, escape, enter
    if ([46, 8, 9, 27, 13].some(n => n === e.keyCode) ||
      (e.key === ':') ||
      // Allow: Ctrl/cmd+A
      (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
      // Allow: Ctrl/cmd+C
      (e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true)) ||
      // Allow: Ctrl/cmd+X
      (e.keyCode === 88 && (e.ctrlKey === true || e.metaKey === true)) ||
      // Allow: home, end, left, right, up, down
      (e.keyCode >= 35 && e.keyCode <= 40)) {
      return true;
    }
    return !((e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105));
  }
}
