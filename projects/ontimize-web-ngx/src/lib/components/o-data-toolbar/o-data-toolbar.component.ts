import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { BooleanInputConverter } from '../../decorators/input-converter';


export const DEFAULT_INPUTS_O_DATA_TOOLBAR = [
  // show-title [yes|no|true|false]: show the table title. Default: no.
  'showTitle: show-title',
  //title: This title value will appear in the toolbar
  'title',

];

@Component({
  selector: 'o-data-toolbar',
  templateUrl: './o-data-toolbar.component.html',
  styleUrls: ['./o-data-toolbar.component.scss'],
  inputs: DEFAULT_INPUTS_O_DATA_TOOLBAR,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host:
    { class: 'o-data-toolbar' }

})
export class ODataToolbarComponent {
  @BooleanInputConverter()
  showTitle: boolean = false;

  public title: string;

}
