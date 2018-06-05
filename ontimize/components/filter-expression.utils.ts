export interface IExpression {
  lop: string | IExpression;
  op: string;
  rop?: string | IExpression;
}

/**
 * Utility class for creating filter expressions.
 */
export class FilterExpressionUtils {

  static BASIC_EXPRESSION_KEY = '@basic_expression';

  static FILTER_EXPRESSION_KEY = '@filter_expression';

  /**
   * The `OR` operator.
   */
  static OP_OR: string = 'OR';

  /**
   * The `AND` operator.
   */
  static OP_AND: string = 'AND';

  /**
   * The `LIKE` operator
   */
  static OP_LIKE: string = 'LIKE';

  /**
   * The `NOT LIKE` operator.
   */
  static OP_NOT_LIKE: string = 'NOT LIKE';

  /**
   * The `EQUAL` operator.
   */
  static OP_EQUAL: string = '=';

  /**
   * The `NOT EQUAL` operator.
   */
  static OP_NOT_EQUAL: string = '<>';

  /**
   * The `IS NULL` operator.
   */
  static OP_NULL: string = 'IS NULL';

  /**
   * The `IS NOT NULL` operator.
   */
  static OP_NOT_NULL: string = 'IS NOT NULL';

  /**
   * The `LESS` operator.
   */
  static OP_LESS: string = '<';

  /**
   * The `LES EQUAL` operator.
   */
  static OP_LESS_EQUAL: string = '<=';

  /**
   * The `MORE` operator.
   */
  static OP_MORE: string = '>';

  /**
   * The `MORE EQUAL` operator.
   */
  static OP_MORE_EQUAL: string = '>=';

  /**
   * Evaluates if the type of an expression is `BasicExpression`.
   * @param arg the expression to evaluate.
   * @returns `true` if the provided expression type is `BasicExpression`, `false` otherwise.
   */
  static instanceofBasicExpression(arg: any): boolean {
    return arg.hasOwnProperty(FilterExpressionUtils.BASIC_EXPRESSION_KEY)
      && FilterExpressionUtils.instanceofFilterExpression(arg[FilterExpressionUtils.BASIC_EXPRESSION_KEY]);
  }

  /**
   * Builds a `BasicExpression` from the filter expression (`IExpression`) provided.
   * @param exp the filter expression.
   * @returns the basic expression.
   */
  static buildBasicExpression(exp: IExpression): BasicExpression {
    if (exp) {
      if (!FilterExpressionUtils.instanceofFilterExpression(exp)) {
        console.error('The expression provided is not an instance of \'IExpression\'');
      }
      let be: BasicExpression = {
        [FilterExpressionUtils.BASIC_EXPRESSION_KEY]: exp
      };
      return be;
    }
    return undefined;
  }

  /**
   * Evaluates if an expresion is instance of `FilterExpression`.
   * @param arg the expression to evaluate.
   * @returns `true` if the provided expression is an instance of `FilterExpression`, `false` otherwise.
   */
  static instanceofFilterExpression(arg: any): boolean {
    return arg.hasOwnProperty('lop') && arg.hasOwnProperty('op');
  }

  static buildComplexExpression(expr1: IExpression, expr2: IExpression, op: string): IExpression {
    if (expr1.lop === undefined && expr1.op === undefined) {
      return expr2;
    }
    if (expr2.lop === undefined && expr2.op === undefined) {
      return expr1;
    }
    let expr: IExpression = {
      lop: expr1,
      op: op,
      rop: expr2
    };
    return expr;
  }

  static buildExpressionEquals(col: string, val: any): IExpression {
    let expr: IExpression = {
      lop: col,
      op: FilterExpressionUtils.OP_EQUAL,
      rop: val
    };
    return expr;
  }

  static buildExpressionIsNotNull(col: string): IExpression {
    let expr: IExpression = {
      lop: col,
      op: FilterExpressionUtils.OP_NOT_NULL
    };
    return expr;
  }

  static buildExpressionIsNull(col: string): IExpression {
    let expr: IExpression = {
      lop: col,
      op: FilterExpressionUtils.OP_NULL
    };
    return expr;
  }

  static buildExpressionLess(col: string, val: any): IExpression {
    let expr: IExpression = {
      lop: col,
      op: FilterExpressionUtils.OP_LESS,
      rop: val
    };
    return expr;
  }

  static buildExpressionLessEqual(col: string, val: any): IExpression {
    let expr: IExpression = {
      lop: col,
      op: FilterExpressionUtils.OP_LESS_EQUAL,
      rop: val
    };
    return expr;
  }

  static buildExpressionMore(col: string, val: any): IExpression {
    let expr: IExpression = {
      lop: col,
      op: FilterExpressionUtils.OP_MORE,
      rop: val
    };
    return expr;
  }

  static buildExpressionMoreEqual(col: string, val: any): IExpression {
    let expr: IExpression = {
      lop: col,
      op: FilterExpressionUtils.OP_MORE_EQUAL,
      rop: val
    };
    return expr;
  }

  static buildExpressionNotLike(col: string, val: any): IExpression {
    if (val !== undefined) {
      val = '%' + val + '%';
    }
    let expr: IExpression = {
      lop: col,
      op: FilterExpressionUtils.OP_NOT_LIKE,
      rop: val
    };
    return expr;
  }

  static buildExpressionLike(col: string, val: string): IExpression {
    if (val !== undefined) {
      val = val.replace(new RegExp('\\*', 'g'), '%');
    }
    let expr: IExpression = {
      lop: col,
      op: FilterExpressionUtils.OP_LIKE,
      rop: val
    };
    return expr;
  }

  static buildExpressionLikeEnd(col: string, val: any): IExpression {
    if (val !== undefined) {
      val = '%' + val;
    }
    let expr: IExpression = {
      lop: col,
      op: FilterExpressionUtils.OP_LIKE,
      rop: val
    };
    return expr;
  }

  static buildExpressionLikeStart(col: string, val: any): IExpression {
    if (val !== undefined) {
      val = val + '%';
    }
    let expr: IExpression = {
      lop: col,
      op: FilterExpressionUtils.OP_LIKE,
      rop: val
    };
    return expr;
  }

  static buildExpressionNotEquals(col: string, val: any): IExpression {
    let expr: IExpression = {
      lop: col,
      op: FilterExpressionUtils.OP_NOT_EQUAL,
      rop: val
    };
    return expr;
  }

  static buildExpressionNullAndValue(col: string, val: any, op: string): IExpression {
    const isNull: IExpression = FilterExpressionUtils.buildExpressionIsNull(col);
    const equals: IExpression = FilterExpressionUtils.buildExpressionEquals(col, val);
    let expr: IExpression = {
      lop: isNull,
      op: op,
      rop: equals
    };
    return expr;
  }

  static buildArrayExpressionLike(colNames: any[], val: any): IExpression {
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

  private static stackExpressionLikeOR(col: string, val: any, filterExpr: any): IExpression {
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

  private static stackExpressionEqualsAND(col: string, val: any, filterExpr: any): IExpression {
    const equalsExpr = FilterExpressionUtils.buildExpressionEquals(col, val);
    if (filterExpr.lop === undefined && filterExpr.op === undefined) {
      return equalsExpr;
    } else {
      filterExpr = FilterExpressionUtils.buildComplexExpression(filterExpr, equalsExpr, FilterExpressionUtils.OP_AND);
    }
    return filterExpr;
  }

}
