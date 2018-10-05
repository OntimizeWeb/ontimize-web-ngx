import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Util } from '../../../util/util';

@Component({
  moduleId: module.id,
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
