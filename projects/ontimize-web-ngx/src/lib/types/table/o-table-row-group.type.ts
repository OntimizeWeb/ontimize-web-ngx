export class OTableGroupedRow {
  level = 0;
  column = {};
  parent: OTableGroupedRow;
  expanded = true;
  totalCounts = 0;
  get visible(): boolean {
    return !this.parent || (this.parent.visible && this.parent.expanded);
  }
}
