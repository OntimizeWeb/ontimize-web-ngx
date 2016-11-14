import {Component, Input,
  NgModule,
  ModuleWithProviders,
  ViewEncapsulation} from '@angular/core';

import { MdListModule } from '@angular2-material/list';

@Component({
  selector: 'o-list-item',
  templateUrl: 'list/o-list-item.component.html',
  styleUrls: ['list/o-list-item.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class OListItemComponent {

  @Input() model: Object;

  getModel() {
    return this.model;
  }
}

@NgModule({
  declarations: [OListItemComponent],
  imports: [MdListModule],
  exports: [OListItemComponent],
})
export class OListItemModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OListItemModule,
      providers: []
    };
  }
}
