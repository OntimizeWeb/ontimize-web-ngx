export interface IIntegerPipeArgument {
  grouping?: boolean;
  thousandSeparator?: string;
  locale?: string;
}

export interface IRealPipeArgument {
  grouping?: boolean;
  thousandSeparator?: string;
  locale?: string;
  decimalSeparator?: string;
  decimalDigits?: number;
}
