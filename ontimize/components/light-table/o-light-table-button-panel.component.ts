import {Component, Inject, forwardRef,
  NgModule,
  ModuleWithProviders,
  ViewEncapsulation} from '@angular/core';
import {OLightTableComponent} from './o-light-table.component';

import { MdIconModule, MdToolbarModule, MdButtonModule } from '@angular/material';
import { OSharedModule } from '../../shared.module';

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
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OLightTableButtonPanelModule,
      providers: []
    };
  }
}
