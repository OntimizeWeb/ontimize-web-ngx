import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

import { Util } from '../../../util/util';

@Component({
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
