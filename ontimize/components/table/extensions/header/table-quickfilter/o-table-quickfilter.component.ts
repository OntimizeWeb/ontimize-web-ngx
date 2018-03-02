import { Component, OnInit, Inject, forwardRef, EventEmitter, Injector, ViewEncapsulation, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { LocalStorageService } from '../../../../../services';
import { ILocalStorageComponent } from '../../../../o-service-component.class';
import { OTableComponent } from '../../../o-table.component';

export const DEFAULT_INPUTS_O_TABLE_QUICKFILTER = [
];

export const DEFAULT_OUTPUTS_O_TABLE_QUICKFILTER = [
  'onChange'
];

@Component({
  selector: 'o-table-quickfilter',
  templateUrl: './o-table-quickfilter.component.html',
  styleUrls: ['./o-table-quickfilter.component.scss'],
  inputs: DEFAULT_INPUTS_O_TABLE_QUICKFILTER,
  outputs: DEFAULT_OUTPUTS_O_TABLE_QUICKFILTER,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-table-quickfilter]': 'true',
  }
})

export class OTableQuickfilterComponent implements OnInit, AfterViewInit, OnDestroy, ILocalStorageComponent {
  public static DEFAULT_INPUTS_O_TABLE_QUICKFILTER = DEFAULT_INPUTS_O_TABLE_QUICKFILTER;
  public static DEFAULT_OUTPUTS_O_TABLE_QUICKFILTER = DEFAULT_OUTPUTS_O_TABLE_QUICKFILTER;

  protected localStorageService: LocalStorageService;
  protected state: any;
  @ViewChild('filter') filter: ElementRef;


  protected quickFilterObservable: Subscription;

  public onChange: EventEmitter<Object> = new EventEmitter<Object>();

  constructor(
    protected injector: Injector,
    @Inject(forwardRef(() => OTableComponent)) protected table: OTableComponent
  ) {
    this.localStorageService = this.injector.get(LocalStorageService);
  }

  public ngOnInit() {
    this.state = this.localStorageService.getComponentStorage(this);
    // this.table.registerHeaderButton(this);
  }

  ngAfterViewInit() {
    this.initializeEventFilter();
  }


  getDataToStore(): Object {
    return {
      'filter': this.filter ? this.filter.nativeElement.value : ''
    };
  }

  getComponentKey(): string {
    return this.table.getComponentKey();
  }

  initializeEventFilter() {
    setTimeout(() => {
      if (this.filter && !this.quickFilterObservable) {
        this.quickFilterObservable = Observable.fromEvent(this.filter.nativeElement, 'keyup')
          .debounceTime(150).distinctUntilChanged().subscribe(() => {
            const filterValue = this.filter.nativeElement.value;
            if (!this.table.dataSource || this.table.dataSource.quickFilter === filterValue) {
              return;
            }
            if (!this.table.pageable) {
              this.table.dataSource.quickFilter = filterValue;
            } else {
              this.onChange.emit('%' + filterValue + '%');
            }
          });

        //if exists filter value in storage then filter result table
        let filterValue = this.state.filter || this.filter.nativeElement.value;
        this.filter.nativeElement.value = filterValue;
        if (this.table.dataSource && filterValue && filterValue.length) {
          this.table.dataSource.quickFilter = filterValue;
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.quickFilterObservable) {
      this.quickFilterObservable.unsubscribe();
    }
  }
}
