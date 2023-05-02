import { ChangeDetectionStrategy, Component, forwardRef, Inject, ViewEncapsulation } from "@angular/core";
import { OColumn } from "../../../column";
import { OTableComponent } from "../../../o-table.component";
import { DEFAULT_INPUTS_O_TABLE_HEADER, OTableHeaderComponent } from "../table-header/o-table-header.component";
import { BehaviorSubject, Subscription } from "rxjs";

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
  public isAllSelected = new BehaviorSubject<boolean>(false);
  public isIndeterminate = new BehaviorSubject<boolean>(false);
  public selectionChangeSubscription: Subscription;

  constructor(
    @Inject(forwardRef(() => OTableComponent)) public table: OTableComponent
  ) {
    super(table);
    this.selectionChangeSubscription = this.table.selection.changed.subscribe(x => {
      this.isAllSelected.next(table.isAllSelected());
      this.isIndeterminate.next(table.isIndeterminate());
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