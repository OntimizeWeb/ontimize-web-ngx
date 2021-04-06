import { ChangeDetectionStrategy, Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { OComboCustomRenderer } from '../o-combo-renderer.class';

@Component({
  selector: 'o-combo-renderer-country-flag',
  templateUrl: './o-combo-renderer-country-flag.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class OComboRendererCountryFlagComponent extends OComboCustomRenderer implements OnInit {
  @ViewChild('templateref', { read: TemplateRef, static: true }) public templateref: TemplateRef<any>;

  public flag: boolean = true;

  constructor(protected injector: Injector) {
    super(injector);
  }

  initialize() {
    super.initialize();
  }

}
