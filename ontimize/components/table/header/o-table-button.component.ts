import { Component, OnInit, Inject, forwardRef, EventEmitter, Injector } from '@angular/core';
import { OTableComponent } from '../o-table.component';

export const DEFAULT_INPUTS_O_TABLE_BUTTON = [
    'icon',
    'olabel: label'
];

export const DEFAULT_OUTPUTS_O_TABLE_BUTTON = [
    'onClick'
];

@Component({
    selector: 'o-table-button',
    template: '',
    inputs: [
        ...DEFAULT_INPUTS_O_TABLE_BUTTON
    ],
    outputs: [
        ...DEFAULT_OUTPUTS_O_TABLE_BUTTON
    ]
})

export class OTableButtonComponent implements OnInit {

    public static DEFAULT_INPUTS_O_TABLE_BUTTON = DEFAULT_INPUTS_O_TABLE_BUTTON;
    public static DEFAULT_OUTPUTS_O_TABLE_BUTTON = DEFAULT_OUTPUTS_O_TABLE_BUTTON;

    public onClick: EventEmitter<Object> = new EventEmitter<Object>();

    protected table: OTableComponent;
    public icon: string;
    public olabel: string;
    public class: string;


    constructor(protected injector: Injector, @Inject(forwardRef(() => OTableComponent)) table: OTableComponent) {
        this.table = table;
    }

    public ngOnInit() {

        if (typeof this.icon === 'undefined') {
            this.icon = 'priority_high';
            this.class = 'icon-' + this.icon;
        }
        this.table.registerHeaderButton(this);
    }

    public getLabel() {
        return this.olabel;
    }

    public getIcon() {
        return this.icon;
    }

    public getClass() {
        return this.class;
    }

    innerOnClick() {
        this.onClick.emit();
    }
}
