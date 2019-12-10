import { async, TestBed } from '@angular/core/testing';
import { OTableColumnComponent, O_TABLE_CELL_EDITORS, O_TABLE_CELL_RENDERERS, O_TABLE_DIALOGS, O_TABLE_FOOTER_COMPONENTS, O_TABLE_HEADER_COMPONENTS } from '../../..';
import { OTableColumnCalculatedComponent } from './column/calculated/o-table-column-calculated.component';
import { OTableContextMenuComponent } from './extensions/contextmenu/o-table-context-menu.component';
import { OTableRowDirective } from './extensions/row/o-table-row.directive';
import { OTableExpandedFooter } from './o-table-expanded-footer.directive';
import { OTableComponent } from './o-table.component';


describe('OTableComponent', () => {
  beforeEach(async(() => {
    debugger;
    TestBed.configureTestingModule({
      declarations: [
        OTableComponent,
        OTableColumnComponent,
        OTableColumnCalculatedComponent,
        OTableContextMenuComponent,
        OTableRowDirective,
        OTableExpandedFooter,
        ...O_TABLE_CELL_RENDERERS,
        ...O_TABLE_CELL_EDITORS,
        ...O_TABLE_DIALOGS,
        ...O_TABLE_HEADER_COMPONENTS,
        ...O_TABLE_FOOTER_COMPONENTS
      ],
    }).compileComponents();
  }));

  it('should create the component', async(() => {
    const fixture = TestBed.createComponent(OTableComponent);
    console.log(fixture);
    // debugger;
    // const app = fixture.debugElement.componentInstance;
    // expect(app).toBeTruthy();
  }));

  // it(`should have as title 'app works!'`, async(() => {
  //   const fixture = TestBed.createComponent(OTableComponent);
  //   const app = fixture.debugElement.componentInstance;
  //   expect(app.title).toEqual('app works!');
  // }));

  // it('should render title in a h1 tag', async(() => {
  //   const fixture = TestBed.createComponent(OTableComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('h1').textContent).toContain('app works!');
  // }));
});
