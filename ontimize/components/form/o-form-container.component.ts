import { Component, ViewEncapsulation, ViewContainerRef, ViewChild, ComponentFactoryResolver, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OSharedModule } from '../../shared';
import { OBreadcrumbComponent } from '../../components';
import { InputConverter } from '../../decorators';
import { OFormLayoutManagerComponent } from '../../layouts';
import { OFormComponent } from './o-form.component';

export const DEFAULT_INPUTS_O_FORM_CONTAINER = [
  // breadcrumb [boolean]: show breadscrum of the form. Default: yes.
  'breadcrumb',
  'breadcrumbSeparator : breadcrumb-separator',
  'breadcrumbLabelColumns : breadcrumb-label-columns'
];

@Component({
  moduleId: module.id,
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

export class OFormContainerComponent {

  @ViewChild('breadcrumb', { read: ViewContainerRef }) breadContainer;

  @InputConverter()
  breadcrumb: boolean = false;
  public breadcrumbLabelColumns: string;
  public breadcrumbSeparator: string = ' ';

  protected form: OFormComponent;
  protected formMananger: OFormLayoutManagerComponent;

  constructor(private resolver: ComponentFactoryResolver) {
  }

  ngAfterViewInit() {
    this.breadcrumb = this.breadcrumb && this.form && !this.formMananger;
    if (this.breadcrumb) {
      this.createBreadcrumb(this.breadContainer);
    }
  }

  setForm(form: OFormComponent) {
    this.form = form;
    this.formMananger = form.getFormManager();
  }

  createBreadcrumb(container: any) {
    const factory = this.resolver.resolveComponentFactory(OBreadcrumbComponent);
    const ref = container.createComponent(factory);
    ref.instance._formRef = this.form;
    ref.instance.labelColumns = this.breadcrumbLabelColumns;
    ref.instance.separator = this.breadcrumbSeparator;
  }
}

@NgModule({
  declarations: [OFormContainerComponent],
  imports: [OSharedModule, CommonModule],
  entryComponents: [OBreadcrumbComponent],
  exports: [OFormContainerComponent]
})
export class OFormContainerModule {
}
