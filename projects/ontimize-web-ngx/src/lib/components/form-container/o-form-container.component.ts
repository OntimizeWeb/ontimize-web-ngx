import { AfterViewInit, Component, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { OBreadcrumbComponent } from '../../components/breadcrumb/o-breadcrumb.component';
import { BooleanInputConverter } from '../../decorators/input-converter';
import { OFormBase } from '../form/o-form-base.class';
import { OFormLayoutManagerBase } from '../../layouts/form-layout/o-form-layout-manager-base.class';

export const DEFAULT_INPUTS_O_FORM_CONTAINER = [
  // breadcrumb [boolean]: show breadscrum of the form. Default: yes.
  'breadcrumb',
  'breadcrumbSeparator : breadcrumb-separator',
  'breadcrumbLabelColumns : breadcrumb-label-columns',
  'form'
];

@Component({
  selector: 'o-form-container',
  templateUrl: './o-form-container.component.html',
  styleUrls: ['./o-form-container.component.scss'],
  inputs: DEFAULT_INPUTS_O_FORM_CONTAINER,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-form-container]': 'true',
    '[class.breadcrumb]': 'breadcrumb'
  }
})
export class OFormContainerComponent implements AfterViewInit {

  @ViewChild('breadcrumb', { read: ViewContainerRef }) breadContainer: ViewContainerRef;

  @BooleanInputConverter()
  breadcrumb: boolean = false;
  public breadcrumbLabelColumns: string;
  public breadcrumbSeparator: string = ' ';

  protected form: OFormBase;
  protected formMananger: OFormLayoutManagerBase;

  constructor() { }

  ngAfterViewInit() {
    this.breadcrumb = this.breadcrumb && this.form && !this.formMananger;
    if (this.breadcrumb) {
      this.createBreadcrumb(this.breadContainer);
    }
  }

  setForm(form: OFormBase) {
    this.form = form;
    this.formMananger = form.getFormManager();
  }

  createBreadcrumb(container: ViewContainerRef) {
    const ref = container.createComponent(OBreadcrumbComponent);
    ref.instance.form = this.form;
    ref.instance.labelColumns = this.breadcrumbLabelColumns;
    ref.instance.separator = this.breadcrumbSeparator;
  }

}
