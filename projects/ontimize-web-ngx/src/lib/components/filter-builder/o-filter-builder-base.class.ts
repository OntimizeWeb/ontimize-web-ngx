import type { OFilterBuilderValues } from "../../types/o-filter-builder-values.type";

export abstract class OFilterBuilderBase {
  abstract getFilterValues(): OFilterBuilderValues[]
  abstract getDataToStore(): any;
  abstract getComponentKey(): string;
}