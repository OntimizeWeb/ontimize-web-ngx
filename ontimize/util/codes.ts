
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

  public static SELECTION_MODE_NONE = 'none';
  public static SELECTION_MODE_SINGLE = 'single';
  public static SELECTION_MODE_MULTIPLE = 'multiple';

  public static HYPHEN_SEPARATOR = '-';
  public static COLUMNS_ALIAS_SEPARATOR = ':';
  public static TYPE_SEPARATOR = ':';
  public static VALUES_SEPARATOR = '=';
  public static ASC_SORT = 'asc';
  public static DESC_SORT = 'desc';

  public static TYPE_INT = 'int';

  public static ROUTE_SEPARATOR = '/';
  public static ROUTE_VARIABLE_CHAR = ':';

  static isDoubleClickMode(value: string): boolean {
    return Codes.DETAIL_MODE_DBLCLICK_VALUES.indexOf(value) !== -1;
  }

  static isValidRowHeight(value: string): boolean {
    return Codes.AVAILABLE_ROW_HEIGHTS_VALUES.indexOf(value) === -1;
  }
}
