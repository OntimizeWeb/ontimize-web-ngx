export class Codes {

  public static PAGINATED_QUERY_METHOD = 'advancedQuery';
  public static DELETE_METHOD = 'delete';
  public static INSERT_METHOD = 'insert';
  public static UPDATE_METHOD = 'update';
  public static QUERY_METHOD = 'query';

  public static DEFAULT_QUERY_ROWS = 10;

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

  public static SESSION_KEY = 'session';
  public static SESSION_EXPIRED_KEY = 'session-expired';

  public static LOGIN_ROUTE = '/login';
  public static FORBIDDEN_ROUTE = '403';
  public static DEFAULT_EDIT_ROUTE = 'edit';
  public static DEFAULT_DETAIL_ROUTE = undefined;
  public static DEFAULT_INSERT_ROUTE = 'new';

  public static IGNORE_CAN_DEACTIVATE = 'ignore_can_deactivate';

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

  static isDoubleClickMode(value: string): boolean {
    return Codes.DETAIL_MODE_DBLCLICK_VALUES.indexOf(value) !== -1;
  }

  static isValidRowHeight(value: string): boolean {
    return Codes.AVAILABLE_ROW_HEIGHTS_VALUES.indexOf(value) !== -1;
  }

  static getIsDetailObject(): any {
    let res = {};
    res[Codes.IS_DETAIL] = 'true';
    return res;
  }
}
