import { ChangeDetectionStrategy, Component, inject, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { IMomentPipeArgument, OMomentPipe } from '../../../../../pipes/o-moment.pipe';
import { DEFAULT_INPUTS_O_LISTPICKER_RENDERER, OListPickerCustomRenderer } from '../o-list-picker-renderer.class';

export const DEFAULT_INPUTS_O_LISTPICKER_RENDERER_DATE = [
  ...DEFAULT_INPUTS_O_LISTPICKER_RENDERER,
  // format [string]: date format. See MomentJS (http://momentjs.com/).
  'format'
];

@Component({
  standalone: true,
  selector: 'o-list-picker-renderer-date',
  templateUrl: './o-list-picker-renderer-date.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: DEFAULT_INPUTS_O_LISTPICKER_RENDERER_DATE,
  providers: [OMomentPipe]
})
export class OListPickerRendererDateComponent extends OListPickerCustomRenderer implements OnInit {

  protected componentPipe = inject(OMomentPipe);
  protected pipeArguments: IMomentPipeArgument;

  protected format: string;

  @ViewChild('templateref', { read: TemplateRef, static: true }) public templateref: TemplateRef<any>;

  constructor(protected injector: Injector) {
    super(injector);
  }

  setComponentPipe() {
  }

  initialize() {
    super.initialize();
    // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    this.pipeArguments = {
      format: this.format
    };
  }
}
