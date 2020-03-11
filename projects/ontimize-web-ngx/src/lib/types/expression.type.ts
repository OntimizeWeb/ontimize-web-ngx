/**
 * Defines an operation between two operands.
 */
export type Expression = {
  /** The left operand. */
  lop: string | Expression;
  /** The operator. */
  op: string;
  /** The right operand. */
  rop?: string | any[] | Expression;
};

