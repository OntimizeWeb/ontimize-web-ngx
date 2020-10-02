import { Component, Input, AfterViewInit } from '@angular/core';
import { OServiceComponent } from '../o-service-component.class';

export const DEFAULT_INPUT_O_EXPANDABLE_CONTAINER = [
  // targets [`OServiceComponent` instance]: Components whose query will be launched when expanding the row.
  'targets',
  'data'
];
@Component({
  selector: 'o-expandable-container',
  templateUrl: './expandable-container.component.html',
  inputs: DEFAULT_INPUT_O_EXPANDABLE_CONTAINER
})
export class OExpandableContainerComponent implements AfterViewInit {

  @Input() targets: Array<OServiceComponent>;
  @Input() data: any;
  constructor() { }

  ngAfterViewInit(): void {
    const self = this;
    this.targets.forEach(x => {
      x.queryData();
    });

  }

}
