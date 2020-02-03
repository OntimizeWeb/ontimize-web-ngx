import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCheckbox } from '@angular/material';
import { RouterModule } from '@angular/router';

import { OSharedModule } from '../../shared/shared.module';
import { OSearchInputModule } from '../input/search-input/o-search-input.module';
import { OListItemComponent } from './list-item/o-list-item.component';
import { OListComponent } from './o-list.component';
import { OListItemAvatarComponent } from './renderers/o-list-item-avatar.component';
import { OListItemCardImageComponent } from './renderers/o-list-item-card-image.component';
import { OListItemCardComponent } from './renderers/o-list-item-card.component';
import { OListItemTextComponent } from './renderers/o-list-item-text.component';

@NgModule({
  declarations: [
    OListComponent,
    OListItemComponent,
    OListItemAvatarComponent,
    OListItemCardImageComponent,
    OListItemCardComponent,
    OListItemTextComponent
  ],
  imports: [CommonModule, OSearchInputModule, OSharedModule, RouterModule],
  exports: [OListComponent],
  entryComponents: [MatCheckbox]
})
export class OListModule { }
