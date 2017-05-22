import {Component, Inject, forwardRef,
  NgModule,
  ViewEncapsulation
} from '@angular/core';
import {OLightTableComponent} from './o-light-table.component';

import { MdIconModule, MdToolbarModule, MdButtonModule } from '@angular/material';
import { OSharedModule } from '../../shared';

@Component({
  selector: 'o-light-table-button-panel',
  template: require('./o-light-table-button-panel.component.html'),
  styles: [require('./o-light-table-button-panel.component.scss')],
  encapsulation: ViewEncapsulation.None
})
export class OLightTableButtonPanelComponent {

  private table: OLightTableComponent;
  constructor( @Inject(forwardRef(() => OLightTableComponent)) table: OLightTableComponent) {
    this.table = table;
  }

}


@NgModule({
  declarations: [OLightTableButtonPanelComponent],
  imports: [OSharedModule, MdIconModule, MdToolbarModule, MdButtonModule],
  exports: [OLightTableButtonPanelComponent],
})
export class OLightTableButtonPanelModule {
}
