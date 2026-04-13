import { NgModule } from '@angular/core';

import { OListItemComponent } from './list-item/o-list-item.component';
import { OListComponent } from './o-list.component';
import { OListItemAvatarComponent } from './renderers/avatar/o-list-item-avatar.component';
import { OListItemCardImageComponent } from './renderers/card-image/o-list-item-card-image.component';
import { OListItemCardComponent } from './renderers/card/o-list-item-card.component';
import { OListItemTextComponent } from './renderers/text/o-list-item-text.component';
import { OListSkeletonComponent } from './skeleton/o-list-skeleton.component';


/** @deprecated Use the standalone component directly. Import the component class instead of this module. */
@NgModule({
    imports: [
        OListComponent,
        OListItemComponent,
        OListSkeletonComponent,
        OListItemAvatarComponent,
        OListItemCardImageComponent,
        OListItemCardComponent,
        OListItemTextComponent
    ],
    exports: [
        OListComponent,
        OListItemComponent,
        OListItemAvatarComponent,
        OListItemCardImageComponent,
        OListItemCardComponent,
        OListItemTextComponent
    ]
})
export class OListModule { }
