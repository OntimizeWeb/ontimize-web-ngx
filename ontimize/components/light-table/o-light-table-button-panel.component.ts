import {Component, Inject, forwardRef,
  NgModule,
  ViewEncapsulation
} from '@angular/core';
import {OLightTableComponent} from './o-light-table.component';

import { OSharedModule } from '../../shared';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'o-light-table-button-panel',
  templateUrl: './o-light-table-button-panel.component.html',
  styleUrls: ['./o-light-table-button-panel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OLightTableButtonPanelComponent {

  public table: OLightTableComponent;
  constructor( @Inject(forwardRef(() => OLightTableComponent)) table: OLightTableComponent) {
    this.table = table;
  }

}


@NgModule({
  declarations: [OLightTableButtonPanelComponent],
  imports: [OSharedModule, CommonModule],
  exports: [OLightTableButtonPanelComponent],
})
export class OLightTableButtonPanelModule {
}
