import { Component, OnInit, Injector, Optional, Inject, forwardRef, OnDestroy, SkipSelf, ElementRef, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Util } from '../../utils';
import { OSharedModule } from '../../shared';
import { OFormComponent } from '../form/o-form.component';
import { OTreeComponent } from './o-tree.component';
import { OServiceBaseComponent } from '../o-service-base-component.class';

export const DEFAULT_INPUTS_O_TREE_NODE = [
  ...OServiceBaseComponent.DEFAULT_INPUTS_O_SERVICE_BASE_COMPONENT,

  // sort-columns [string]: initial sorting, with the format column:[ASC|DESC], separated by ';'. Default: no value.
  'sortColumns: sort-columns',

  'descriptionColumns: description-columns',

  'separator',

  'parentColumn: parent-column',

  'showRoot: show-root',

  'rootTitle: root-title',

  'recursive',

  'recursiveLevels: recursive-levels',

  'translate',

  'route'
];

export const DEFAULT_OUTPUTS_O_TREE_NODE = [
  'onNodeSelected',
  'onNodeMoved',
  'onNodeCreated',
  'onNodeRemoved',
  'onNodeRenamed',
  'onNodeExpanded',
  'onNodeCollapsed',
  'onLoadNextLevel'];

@Component({
  selector: 'o-tree-node',
  template: ' ',
  inputs: DEFAULT_INPUTS_O_TREE_NODE,
  outputs: DEFAULT_OUTPUTS_O_TREE_NODE
})

export class OTreeNodeComponent extends OTreeComponent implements OnInit, OnDestroy {
  public static DEFAULT_INPUTS_O_TREE_NODE = DEFAULT_INPUTS_O_TREE_NODE;
  public static DEFAULT_OUTPUTS_O_TREE_NODE = DEFAULT_OUTPUTS_O_TREE_NODE;

  constructor(
    injector: Injector,
    elRef: ElementRef,
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    @Optional() @Inject(forwardRef(() => OTreeComponent)) public oTree: OTreeComponent,
    @SkipSelf() @Optional() public parentNode: OTreeNodeComponent
  ) {
    super(injector, elRef, form);
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

  registerChildNode(child: OTreeNodeComponent) {
    this.treeNodes.push(child);
  }
}

@NgModule({
  declarations: [OTreeNodeComponent],
  imports: [OSharedModule, CommonModule],
  exports: [OTreeNodeComponent]
})
export class OTreeNodeModule {
}

