import { OTreeComponent } from "../components/tree/o-tree.component";
import { OTreeNodeComponent } from "../components/tree/tree-node/tree-node.component";

export type OTreeFlatNode = {
  id: string | number,
  label: string;
  level: number,
  rootNode?: boolean,
  expandable: boolean,
  node?: OTreeComponent | OTreeNodeComponent,
  childNode?: OTreeNodeComponent,
  data: any;
  isLoading?: boolean;
  route?: string;
  hasMore?: boolean;
  startIndex?: number;// to load pageable items
  offset?: number;
  totalQueryRecordsNumber?: number;
}
