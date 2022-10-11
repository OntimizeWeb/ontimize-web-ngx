import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { InputConverter } from '../../decorators/input-converter';


export const DEFAULT_INPUTS_O_DATA_TOOLBAR = [
  // show-title [yes|no|true|false]: show the table title. Default: no.
  'showTitle: show-title',
  //title: This title value will appear in the toolbar
  'title',

];

@Component({
  selector: 'o-data-toolbar',
  templateUrl:'./o-data-toolbar.component.html',
  inputs: DEFAULT_INPUTS_O_DATA_TOOLBAR,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ODataToolbarComponent {
  @InputConverter()
  showTitle: boolean = false;

  public title: string;

  constructor() { }



}
