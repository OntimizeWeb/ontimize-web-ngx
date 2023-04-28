import { ChangeDetectionStrategy, Component, forwardRef, Inject, ViewChild, ViewEncapsulation } from "@angular/core";
import { OColumn } from "../../../column";
import { OTableComponent } from "../../../o-table.component";
import { DEFAULT_INPUTS_O_TABLE_HEADER, OTableHeaderComponent } from "../table-header/o-table-header.component";
import { delay } from "rxjs/operators";
import { Subscription } from "rxjs";


@Component({
  selector: 'o-table-header-select-all',
  inputs: DEFAULT_INPUTS_O_TABLE_HEADER,
  templateUrl: './o-table-header-select-all.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.o-table-header-select-all]': 'true'
  }
})
export class OTableHeaderSelectAllComponent extends OTableHeaderComponent {

  public column: OColumn
  public resizable: boolean;
  public isAllSelected: boolean;
  public isIndeterminate: boolean;
  public selectionChangeSubscription: Subscription;

  constructor(
    @Inject(forwardRef(() => OTableComponent)) public table: OTableComponent
  ) {
    super(table);
    this.selectionChangeSubscription =this.table.selection.changed.subscribe(x => {
      this.isAllSelected = table.isAllSelected();
      this.isIndeterminate = table.isIndeterminate();
    })
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (this.selectionChangeSubscription) {
      this.selectionChangeSubscription.unsubscribe();
    }
  }

}