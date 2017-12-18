import {
    Component,
    ViewEncapsulation,
    ViewContainerRef,
    ViewChild,
    ComponentFactoryResolver,
    NgModule,
    Renderer2,
    ElementRef
} from '@angular/core';

import { OSharedModule } from '../../shared';
import { CommonModule } from '@angular/common';

import { OBreadcrumbComponent } from '../../components';
import { InputConverter } from '../../decorators';

export const DEFAULT_INPUTS_O_FORM_CONTAINER = [
    // breadcrum [boolean]: show breadscrum of the form. Default: yes.
    'breadcrum'
];

@Component({
    selector: 'o-form-container',
    templateUrl: './o-form-container.component.html',
    styleUrls: ['./o-form-container.component.scss'],
    inputs: DEFAULT_INPUTS_O_FORM_CONTAINER,
    encapsulation: ViewEncapsulation.None
})

export class OFormContainerComponent {

    @ViewChild('breadcrum', { read: ViewContainerRef }) breadContainer;

    @InputConverter()
    protected breadcrum: boolean = true;

    constructor(private resolver: ComponentFactoryResolver,
        private renderer: Renderer2, private elRef: ElementRef) {
    }

    ngOnInit() {
        if (this.breadcrum) {
            const factory = this.resolver.resolveComponentFactory(OBreadcrumbComponent);
            this.breadContainer.createComponent(factory);
        }
    }

    ngAfterViewInit() {
        let className: string = '';
        if (this.breadcrum) {
            className = 'o-form-container-breadcrum';
        } else {
            className = 'o-form-container';
        }
        this.renderer.addClass(this.elRef.nativeElement, className);

    }
}

@NgModule({
    declarations: [OFormContainerComponent],
    imports: [OSharedModule, CommonModule],
    entryComponents: [OBreadcrumbComponent],
    exports: [OFormContainerComponent],
})
export class OFormContainerModule {
}
