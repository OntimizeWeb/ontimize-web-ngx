export type OFilterBuilderValues = {
  attr: string,
  value: any;
}

export type OFilterBuilderStatus = {
  name: string;
  description: string;
  'stored-filter': OFilterBuilderValues[];
}