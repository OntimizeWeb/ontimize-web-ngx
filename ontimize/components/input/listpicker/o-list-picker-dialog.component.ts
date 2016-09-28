import {Component, forwardRef, Inject, OnInit,
  ViewEncapsulation} from '@angular/core';

import {MdDialog } from '../../material/ng2-material/index';

import {InputConverter} from '../../../decorators';
import {Util} from '../../../util/util';


export const DEFAULT_INPUTS_O_LIST_PICKER = [
  'data',
  'visibleColumns: visible-columns',
  'filter'
];

@Component({
  selector: 'o-list-picker-dialog',
  templateUrl: '/input/listpicker/o-list-picker-dialog.component.html',
  styleUrls: ['/input/listpicker/o-list-picker.component.css'],
  inputs: [
    ...DEFAULT_INPUTS_O_LIST_PICKER
  ],
  encapsulation: ViewEncapsulation.None
})
export class OListPickerDialogComponent implements OnInit {

  data: Array<any>;
  visibleColumns: string;
  @InputConverter()
  filter: boolean = true;

  visibleColsArray: Array<string>;

  constructor(
    @Inject(forwardRef(() => MdDialog)) private dialog: MdDialog
  ) {}

  ngOnInit(): any {
    this.visibleColsArray = Util.parseArray(this.visibleColumns);
  }

  onClickListItem(e: Event, value: any): void {
    this.dialog.close(value);
  }

}


