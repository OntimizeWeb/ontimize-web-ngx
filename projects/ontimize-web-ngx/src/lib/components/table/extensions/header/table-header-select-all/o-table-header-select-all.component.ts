import { ChangeDetectionStrategy, Component, forwardRef, Inject, ViewEncapsulation } from "@angular/core";
import { DEFAULT_INPUTS_O_TABLE_HEADER, OTableHeaderComponent } from "../table-header/o-table-header.component";
import { BehaviorSubject, merge, Subscription } from "rxjs";
import type { OColumn } from "../../../column/o-column.class";
import { OTableBase } from "../../../o-table-base.class";

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

  public column: OColumn;
  public resizable: boolean;
  public isAllSelected = new BehaviorSubject<boolean>(false);
  public isIndeterminate = new BehaviorSubject<boolean>(false);
  public selectionChangeSubscription: Subscription;

  constructor(
    @Inject(forwardRef(() => OTableBase)) public table: OTableBase
  ) {
    super(table);
  }

  public ngAfterViewInit(): void {
    const dataChanges: any[] = [
      this.table.selection.changed
    ];

    if (this.table.matpaginator) {
      dataChanges.push(this.table.matpaginator.page);
    }

    this.selectionChangeSubscription = merge(...dataChanges).subscribe(x => {
      this.isAllSelected.next(this.table.isAllSelected());
      this.isIndeterminate.next(this.table.isIndeterminate());
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