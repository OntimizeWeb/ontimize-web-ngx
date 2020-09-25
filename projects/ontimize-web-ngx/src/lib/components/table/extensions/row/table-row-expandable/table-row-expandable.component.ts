import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ViewChild, TemplateRef, AfterContentInit, AfterViewInit, ContentChild, EventEmitter, Output } from '@angular/core';

import { OServiceComponent } from '../../../../o-service-component.class';
export const DEFAULT_OUTPUTS_O_TABLE_ROW_EXPANDABLE = [
  'onExpanded',
  'onCollapsed'
];

export const DEFAULT_INPUT_O_TABLE_ROW_EXPANDABLE = [
  // target [`OServiceComponent` instance]: Component whose data will be filtered.
  'target'
];

@Component({
  selector: 'o-table-row-expandable',
  template: ' ',
  // template: `
  //   <ng-template #templateRef let-row="row">
  //     table-row-expandable works! {{row}}
  //   </ng-template>
  // `,
  inputs: DEFAULT_INPUT_O_TABLE_ROW_EXPANDABLE,
  outputs: DEFAULT_OUTPUTS_O_TABLE_ROW_EXPANDABLE,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OTableRowExpandableComponent implements OnInit, AfterContentInit, AfterViewInit {

  constructor() { }

  @ContentChild(TemplateRef, { static: false }) templateRef: TemplateRef<any>;
  @Output() onExpanded = new EventEmitter<any>();
  @Output() onCollapsed = new EventEmitter<any>();

  // @ViewChild('templateRef', { read: TemplateRef, static: true }) templateRef: TemplateRef<any>;
  public targetCmp: OServiceComponent;
  public target: string;
  public targetArray = [];
  ngOnInit() {
    //this.targetArray = Util.parseArray(this.targetCmp, true);
    console.log('oninit ', this.templateRef);
  }

  ngAfterViewInit(): void {
    console.log('o-table-row-expandable->viewInnit ', this.templateRef);

  }
  ngAfterContentInit(): void {
    console.log('o-table-row-expandable ngAfterContentInit ', this.templateRef);
  }

}
