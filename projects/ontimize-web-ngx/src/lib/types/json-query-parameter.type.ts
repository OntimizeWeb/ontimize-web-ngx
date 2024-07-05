export type JSONAPIQueryParameter = {
  id?: any;
  type?: string;
  attributes?: object;
  relationships?: object;
  link?: object;
  meta?: object;
  page?: object;
  include?: string;
  fields?: { [entity: string]: string };
  filter?: object;
  sort?: string;

}
