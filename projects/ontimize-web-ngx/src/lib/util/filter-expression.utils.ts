import { BasicExpression } from '../types/basic-expression.type';
import { Expression } from '../types/expression.type';
import { FilterExpression } from '../types/filter-expression.type';

/**
 * Utility class for building basic and filter expressions.
 */
export class FilterExpressionUtils {

  /**
   * The basic expresion key.
   */
  static BASIC_EXPRESSION_KEY = '@basic_expression';

  /**
   * The filter expresion key.
   */
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
   * The `IN` operator.
   */
  static OP_IN: string = 'IN';

  /**
   * Evaluates if the the expression provided is an instance of `BasicExpression`..
   * @param arg the expression to evaluate.
   * @returns `true` if the provided expression is an instance of `BasicExpression`, `false` otherwise.
   */
  static instanceofBasicExpression(arg: any): boolean {
    return arg.hasOwnProperty(FilterExpressionUtils.BASIC_EXPRESSION_KEY)
      && FilterExpressionUtils.instanceofExpression(arg[FilterExpressionUtils.BASIC_EXPRESSION_KEY]);
  }

  /**
   * Builds a `BasicExpression` instance from the filtering expression (`Expression`) provided.
   * @param exp the filtering expression.
   * @returns the basic expression.
   */
  static buildBasicExpression(exp: Expression): BasicExpression {
    if (exp) {
      if (!FilterExpressionUtils.instanceofExpression(exp)) {
        console.error('The expression provided is not an instance of \'Expression\'');
      }
      const be: BasicExpression = {
        '@basic_expression': exp
      };
      return be;
    }
    return undefined;
  }

  /**
   * Evaluates if an expresion is instance of `FilterExpression`.
   * @param exp the expression to evaluate.
   * @returns `true` if the provided expression is an instance of `FilterExpression`, `false` otherwise.
   */
  static instanceofFilterExpression(exp: any): boolean {
    return exp.hasOwnProperty(FilterExpressionUtils.FILTER_EXPRESSION_KEY)
      && FilterExpressionUtils.instanceofExpression(exp[FilterExpressionUtils.FILTER_EXPRESSION_KEY]);
  }

  /**
   * Builds an `FilterExpression` instance from the filtering expression (`Expression`) provided.
   * @param exp the filtering expression.
   * @returns the `FilterExpression`.
   */
  static buildFilterExpression(exp: Expression): FilterExpression {
    if (exp) {
      if (!FilterExpressionUtils.instanceofExpression(exp)) {
        console.error('The expression provided is not an instance of \'Expression\'');
      }
      const be: FilterExpression = {
        '@filter_expression': exp
      };
      return be;
    }
    return undefined;
  }

  /**
   * Evaluates if an expresion is instance of `Expression`.
   * @param exp the expression to evaluate.
   * @returns `true` if the provided expression is an instance of `Expression`, `false` otherwise.
   */
  static instanceofExpression(exp: any): boolean {
    return exp.hasOwnProperty('lop') && exp.hasOwnProperty('op');
  }

  /**
   * Builds a complex `Expression` instance joining two expressions with the provided operator.
   * @param expr1 the first `Expression` to join.
   * @param expr2 the second `Expression` to join.
   * @param op the joining operator.
   * @returns the complex `Expression`.
   */
  static buildComplexExpression(expr1: Expression, expr2: Expression, op: string): Expression {
    if (expr1.lop === undefined && expr1.op === undefined) {
      return expr2;
    }
    if (expr2.lop === undefined && expr2.op === undefined) {
      return expr1;
    }
    const expr: Expression = {
      lop: expr1,
      op: op,
      rop: expr2
    };
    return expr;
  }

  /**
   * Builds an `Expression` instance for filtering the provided key EQUAL to the provided value.
   * @param key the key.
   * @param value the value.
   * @returns the `Expression`.
   */
  static buildExpressionEquals(key: string, value: any): Expression {
    const expr: Expression = {
      lop: key,
      op: FilterExpressionUtils.OP_EQUAL,
      rop: value
    };
    return expr;
  }

  /**
   * Builds an `Expression` instance for filtering the provided key with a NOT NULL value.
   * @param key the key.
   * @returns the `Expression`.
   */
  static buildExpressionIsNotNull(key: string): Expression {
    const expr: Expression = {
      lop: key,
      op: FilterExpressionUtils.OP_NOT_NULL
    };
    return expr;
  }

  /**
   * Builds an `Expression` instance for filtering the provided key with a NULL value.
   * @param key the key.
   * @returns the `Expression`.
   */
  static buildExpressionIsNull(key: string): Expression {
    const expr: Expression = {
      lop: key,
      op: FilterExpressionUtils.OP_NULL
    };
    return expr;
  }

  /**
   * Builds an `Expression` instance for filtering the provided key LESS than the provided value.
   * @param key the key.
   * @param value the value.
   * @returns the `Expression`.
   */
  static buildExpressionLess(key: string, value: any): Expression {
    const expr: Expression = {
      lop: key,
      op: FilterExpressionUtils.OP_LESS,
      rop: value
    };
    return expr;
  }

  /**
   * Builds an `Expression` instance for filtering the provided key LESS OR EQUAL to the provided value.
   * @param key the key.
   * @param value the value.
   * @returns the `Expression`.
   */
  static buildExpressionLessEqual(key: string, value: any): Expression {
    const expr: Expression = {
      lop: key,
      op: FilterExpressionUtils.OP_LESS_EQUAL,
      rop: value
    };
    return expr;
  }

  /**
   * Builds an `Expression` instance for filtering the provided key MORE than the provided value.
   * @param key the key.
   * @param value the value.
   * @returns the `Expression`.
   */
  static buildExpressionMore(key: string, value: any): Expression {
    const expr: Expression = {
      lop: key,
      op: FilterExpressionUtils.OP_MORE,
      rop: value
    };
    return expr;
  }

  /**
   * Builds an `Expression` instance for filtering the provided key MORE OR EQUAL to the provided value.
   * @param key the key.
   * @param value the value.
   * @returns the `Expression`.
   */
  static buildExpressionMoreEqual(key: string, value: any): Expression {
    const expr: Expression = {
      lop: key,
      op: FilterExpressionUtils.OP_MORE_EQUAL,
      rop: value
    };
    return expr;
  }

  static buildExpressionIn(key: string, values: any[]): Expression {
    const expr: Expression = {
      lop: key,
      op: FilterExpressionUtils.OP_IN,
      rop: values
    };
    return expr;
  }

  /**
   * Builds an `Expression` instance for filtering the provided key NOT LIKE the provided value.
   * @param key the key.
   * @param value the value.
   * @returns the `Expression`.
   */
  static buildExpressionNotLike(key: string, value: string): Expression {
    if (value !== undefined) {
      value = value.replace(new RegExp('\\*', 'g'), '%');
      if (value.indexOf('%') === -1) {
        value = '%' + value + '%';
      }
    }
    const expr: Expression = {
      lop: key,
      op: FilterExpressionUtils.OP_NOT_LIKE,
      rop: value
    };
    return expr;
  }

  /**
   * Builds an `Expression` instance for filtering the provided key LIKE the provided value.
   * @param key the key.
   * @param value the value.
   * @returns the `Expression`.
   */
  static buildExpressionLike(key: string, value: string): Expression {
    if (value !== undefined) {
      value = value.replace(new RegExp('\\*', 'g'), '%');
      if (value.indexOf('%') === -1) {
        value = '%' + value + '%';
      }
    }
    const expr: Expression = {
      lop: key,
      op: FilterExpressionUtils.OP_LIKE,
      rop: value
    };
    return expr;
  }

  /**
   * Builds an `Expression` instance for filtering the provided key ENDS LIKE the provided value.
   * @param key the key.
   * @param value the value.
   * @returns the `Expression`.
   */
  static buildExpressionLikeEnd(key: string, value: string): Expression {
    if (value !== undefined) {
      value = '%' + value;
    }
    const expr: Expression = {
      lop: key,
      op: FilterExpressionUtils.OP_LIKE,
      rop: value
    };
    return expr;
  }

  /**
   * Builds an `Expression` instance for filtering the provided key STARTS LIKE the provided value.
   * @param key the key.
   * @param value the value.
   * @returns the `Expression`.
   */
  static buildExpressionLikeStart(key: string, value: string): Expression {
    if (value !== undefined) {
      value = value + '%';
    }
    const expr: Expression = {
      lop: key,
      op: FilterExpressionUtils.OP_LIKE,
      rop: value
    };
    return expr;
  }

  /**
   * Builds an `Expression` instance for filtering the provided key NOT EQUAL the provided value.
   * @param key the key.
   * @param value the value.
   * @returns the `Expression`.
   */
  static buildExpressionNotEquals(key: string, value: any): Expression {
    const expr: Expression = {
      lop: key,
      op: FilterExpressionUtils.OP_NOT_EQUAL,
      rop: value
    };
    return expr;
  }

  /**
   * Builds a complex `Expression` for filtering the provided key with two conditions:
   * * The first filter the provided key with a NULL value.
   * * The second filter the provided key EQUAL to the provided value.
   *
   * Both expressions are joined using the provided operator.
   * @param key the key.
   * @param value the value.
   * @param op the operator.
   * @returns the `Expression`.
   */
  static buildExpressionNullAndValue(key: string, value: any, op: string): Expression {
    const isNull: Expression = FilterExpressionUtils.buildExpressionIsNull(key);
    const equals: Expression = FilterExpressionUtils.buildExpressionEquals(key, value);
    const expr: Expression = {
      lop: isNull,
      op: op,
      rop: equals
    };
    return expr;
  }

  /**
   * Builds a complex `Expression` for filtering the provided keys LIKE the value provided.
   * @param keys the keys.
   * @param value the value.
   * @returns the `Expression`.
   */
  static buildArrayExpressionLike(keys: any[], value: any): Expression {
    let result: Expression = {
      lop: undefined,
      op: undefined
    };
    keys.forEach((col) => {
      result = FilterExpressionUtils.stackExpressionLikeOR(col, value, result);
    });
    return result;
  }

  /**
   * Builds an `Expression` instance from the provided object.
   * @param obj the object.
   * @returns the `Expression`.
   */
  static buildExpressionFromObject(obj: any): Expression {
    let result: Expression = {
      lop: undefined,
      op: undefined
    };
    Object.keys(obj || {}).forEach((key) => {
      result = FilterExpressionUtils.stackExpressionEqualsAND(key, obj[key], result);
    });
    return result;
  }

  private static stackExpressionLikeOR(key: string, value: any, expr: Expression): Expression {
    const likeExpr = FilterExpressionUtils.buildExpressionLike(key, value);
    if (expr.lop === undefined && expr.op === undefined) {
      return likeExpr;
    } else {
      expr = FilterExpressionUtils.buildComplexExpression(expr, likeExpr, FilterExpressionUtils.OP_OR);
    }
    return expr;
  }

  private static stackExpressionEqualsAND(key: string, value: any, expr: Expression): Expression {
    const equalsExpr = FilterExpressionUtils.buildExpressionEquals(key, value);
    if (expr.lop === undefined && expr.op === undefined) {
      return equalsExpr;
    } else {
      expr = FilterExpressionUtils.buildComplexExpression(expr, equalsExpr, FilterExpressionUtils.OP_AND);
    }
    return expr;
  }

}
