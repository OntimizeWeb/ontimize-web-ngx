import { Component, OnInit, Injector, Optional, Inject, forwardRef, OnDestroy, SkipSelf } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { TreeModule, TreeModel, Ng2TreeSettings, RenamableNode, TreeComponent, Tree, NodeSelectedEvent, NodeCollapsedEvent, NodeExpandedEvent, NodeMovedEvent, NodeCreatedEvent, NodeRemovedEvent, NodeRenamedEvent } from 'ng2-tree';
// import { Subscription } from 'rxjs/Subscription';

// import { TreeController } from 'ng2-tree/src/tree-controller';
import { Util } from '../../../utils';
import { OTreeComponent } from '../o-tree.component';
import { OTreeClass } from '../o-tree.class';


export const DEFAULT_INPUTS_O_TREE_NODE = [
  ...OTreeClass.DEFAULT_INPUTS_O_TREE_CLASS
];

export const DEFAULT_OUTPUTS_O_TREE_NODE = [

];

@Component({
  selector: 'o-tree-node',
  template: '',
  inputs: DEFAULT_INPUTS_O_TREE_NODE,
  outputs: DEFAULT_OUTPUTS_O_TREE_NODE
})

export class OTreeNodeComponent extends OTreeClass implements OnInit, OnDestroy {
  public static DEFAULT_INPUTS_O_TREE_NODE = DEFAULT_INPUTS_O_TREE_NODE;
  public static DEFAULT_OUTPUTS_O_TREE_NODE = DEFAULT_OUTPUTS_O_TREE_NODE;

  // oTree: OTreeComponent;
  // parentNode: OTreeNodeComponent;

  constructor(
    injector: Injector,
    @Optional() @Inject(forwardRef(() => OTreeComponent)) public oTree: OTreeComponent,
    @SkipSelf() @Optional() public parentNode: OTreeNodeComponent
  ) {
    super(injector);
    // try {
    //   this.oTree = this.injector.get(OTreeComponent);
    //   this.parentNode = this.injector.get(OTreeNodeComponent);
    // } catch (e) {
    // }
  }

  ngOnInit(): void {
    super.initialize();
    this.queryOnBind = true;
    this.queryOnInit = false;

    if (Util.isDefined(this.parentNode)) {
      this.parentNode.registerChildNode(this);
    } else if (Util.isDefined(this.oTree)) {
      this.oTree.registerTreeNode(this);
    }
  }

  ngOnDestroy(): void {
    //
  }

  registerChildNode(child: OTreeNodeComponent) {
    this.treeNodes.push(child);
  }

  hasSiblings(): boolean {
    let parent = this.parentNode ? this.parentNode : this.oTree;
    return parent.treeNodes.length > 1;
  }

}
