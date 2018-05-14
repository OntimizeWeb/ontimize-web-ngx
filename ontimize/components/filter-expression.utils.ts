export interface IFilterExpression {
  lop: string | IFilterExpression;
  op: any;
  rop?: string | IFilterExpression;
}

export class FilterExpressionUtils {

  static FILTER_EXPRESSION_KEY = '@filter_expression';
  static OP_OR = 'OR';
  static OP_AND = 'AND';
  static OP_LIKE = 'LIKE';
  static OP_NOT_LIKE = 'NOT LIKE';
  static OP_EQUAL = '=';
  static OP_NOT_EQUAL = '<>';
  static OP_NULL = 'IS NULL';
  static OP_NOT_NULL = 'IS NOT NULL';
  static OP_LESS = '<';
  static OP_LESS_EQUAL = '<=';
  static OP_MORE = '>';
  static OP_MORE_EQUAL = '>=';

  static instanceofFilterExpression(arg: any): boolean {
    return arg.hasOwnProperty('lop') && arg.hasOwnProperty('op');
  }

  static buildComplexExpression(expr1: IFilterExpression, expr2: IFilterExpression, op: string): IFilterExpression {
    if (expr1.lop === undefined && expr1.op === undefined) {
      return expr2;
    }
    if (expr2.lop === undefined && expr2.op === undefined) {
      return expr1;
    }
    let expr: IFilterExpression = {
      lop: expr1,
      op: op,
      rop: expr2
    };
    return expr;
  }

  static buildExpressionEquals(col: string, val: any): IFilterExpression {
    let expr: IFilterExpression = {
      lop: col,
      op: FilterExpressionUtils.OP_EQUAL,
      rop: val
    };
    return expr;
  }

  static buildExpressionIsNotNull(col: string): IFilterExpression {
    let expr: IFilterExpression = {
      lop: col,
      op: FilterExpressionUtils.OP_NOT_NULL
    };
    return expr;
  }

  static buildExpressionIsNull(col: string): IFilterExpression {
    let expr: IFilterExpression = {
      lop: col,
      op: FilterExpressionUtils.OP_NULL
    };
    return expr;
  }

  static buildExpressionLess(col: string, val: any): IFilterExpression {
    let expr: IFilterExpression = {
      lop: col,
      op: FilterExpressionUtils.OP_LESS,
      rop: val
    };
    return expr;
  }

  static buildExpressionLessEqual(col: string, val: any): IFilterExpression {
    let expr: IFilterExpression = {
      lop: col,
      op: FilterExpressionUtils.OP_LESS_EQUAL,
      rop: val
    };
    return expr;
  }

  static buildExpressionMore(col: string, val: any): IFilterExpression {
    let expr: IFilterExpression = {
      lop: col,
      op: FilterExpressionUtils.OP_MORE,
      rop: val
    };
    return expr;
  }

  static buildExpressionMoreEqual(col: string, val: any): IFilterExpression {
    let expr: IFilterExpression = {
      lop: col,
      op: FilterExpressionUtils.OP_MORE_EQUAL,
      rop: val
    };
    return expr;
  }

  static buildExpressionNotLike(col: string, val: any): IFilterExpression {
    if (val !== undefined) {
      val = '%' + val + '%';
    }
    let expr: IFilterExpression = {
      lop: col,
      op: FilterExpressionUtils.OP_NOT_LIKE,
      rop: val
    };
    return expr;
  }

  static buildExpressionLike(col: string, val: string): IFilterExpression {
    if (val !== undefined) {
      val = val.replace(new RegExp('\\*', 'g'), '%');
    }
    let expr: IFilterExpression = {
      lop: col,
      op: FilterExpressionUtils.OP_LIKE,
      rop: val
    };
    return expr;
  }

  static buildExpressionLikeEnd(col: string, val: any): IFilterExpression {
    if (val !== undefined) {
      val = '%' + val;
    }
    let expr: IFilterExpression = {
      lop: col,
      op: FilterExpressionUtils.OP_LIKE,
      rop: val
    };
    return expr;
  }

  static buildExpressionLikeStart(col: string, val: any): IFilterExpression {
    if (val !== undefined) {
      val = val + '%';
    }
    let expr: IFilterExpression = {
      lop: col,
      op: FilterExpressionUtils.OP_LIKE,
      rop: val
    };
    return expr;
  }

  static buildExpressionNotEquals(col: string, val: any): IFilterExpression {
    let expr: IFilterExpression = {
      lop: col,
      op: FilterExpressionUtils.OP_NOT_EQUAL,
      rop: val
    };
    return expr;
  }

  static buildExpressionNullAndValue(col: string, val: any, op: string): IFilterExpression {
    const isNull: IFilterExpression = FilterExpressionUtils.buildExpressionIsNull(col);
    const equals: IFilterExpression = FilterExpressionUtils.buildExpressionEquals(col, val);
    let expr: IFilterExpression = {
      lop: isNull,
      op: op,
      rop: equals
    };
    return expr;
  }

  static buildArrayExpressionLike(colNames: any[], val: any): IFilterExpression {
    const self = this;
    let result = {
      lop: undefined,
      op: undefined
    };
    colNames.forEach((col) => {
      result = self.stackExpressionLikeOR(col, val, result);
    });
    // result[FilterExpressionUtils.FILTER_EXPRESSION_KEY] = result;
    return result;
  }

  private static stackExpressionLikeOR(col: string, val: any, filterExpr: any): IFilterExpression {
    const likeExpr = FilterExpressionUtils.buildExpressionLike(col, val);
    if (filterExpr.lop === undefined && filterExpr.op === undefined) {
      return likeExpr;
    } else {
      filterExpr = FilterExpressionUtils.buildComplexExpression(filterExpr, likeExpr, FilterExpressionUtils.OP_OR);
    }
    return filterExpr;
  }

  static buildExpressionFromObject(filter: any) {
    const self = this;
    let result = {
      lop: undefined,
      op: undefined
    };
    Object.keys(filter || {}).forEach((key) => {
      result = self.stackExpressionEqualsAND(key, filter[key], result);
    });
    return result;
  }

  private static stackExpressionEqualsAND(col: string, val: any, filterExpr: any): IFilterExpression {
    const equalsExpr = FilterExpressionUtils.buildExpressionEquals(col, val);
    if (filterExpr.lop === undefined && filterExpr.op === undefined) {
      return equalsExpr;
    } else {
      filterExpr = FilterExpressionUtils.buildComplexExpression(filterExpr, equalsExpr, FilterExpressionUtils.OP_AND);
    }
    return filterExpr;
  }
}
