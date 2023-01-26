import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCheckbox } from '@angular/material';
import { RouterModule } from '@angular/router';

import { OSharedModule } from '../../shared/shared.module';
import { OSearchInputModule } from '../input/search-input/o-search-input.module';
import { ODataToolbarModule } from '../o-data-toolbar/o-data-toolbar.module';
import { OListItemComponent } from './list-item/o-list-item.component';
import { OListComponent } from './o-list.component';
import { OListItemAvatarComponent } from './renderers/avatar/o-list-item-avatar.component';
import { OListItemCardImageComponent } from './renderers/card-image/o-list-item-card-image.component';
import { OListItemCardComponent } from './renderers/card/o-list-item-card.component';
import { OListItemTextComponent } from './renderers/text/o-list-item-text.component';

@NgModule({
  declarations: [
    OListComponent,
    OListItemComponent,
    OListItemAvatarComponent,
    OListItemCardImageComponent,
    OListItemCardComponent,
    OListItemTextComponent
  ],
  imports: [CommonModule, OSearchInputModule, OSharedModule, RouterModule, ODataToolbarModule],
  exports: [
    OListComponent,
    OListItemComponent,
    OListItemAvatarComponent,
    OListItemCardImageComponent,
    OListItemCardComponent,
    OListItemTextComponent
  ],
  entryComponents: [MatCheckbox]
})
export class OListModule { }
