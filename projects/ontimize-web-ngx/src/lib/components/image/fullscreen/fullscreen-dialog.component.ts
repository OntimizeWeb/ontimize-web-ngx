import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';

import { Util } from '../../../util/util';

@Component({
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatDialogModule, MatIconModule, FlexLayoutModule],
  selector: 'o-fullscreen-dialog',
  templateUrl: './fullscreen-dialog.component.html',
  styleUrls: ['./fullscreen-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-fullscreen-dialog]': 'true'
  }
})
export class OFullScreenDialogComponent {

  imageSrc: any;

  constructor(
    public dialogRef: MatDialogRef<OFullScreenDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (Util.isDefined(data)) {
      this.imageSrc = data;
    }
  }

}
