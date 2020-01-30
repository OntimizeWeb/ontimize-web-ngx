import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'lib-ontimize-web-ngx',
  template: `
    <p>
      ontimize-web-ngx works!
    </p>
  `,
  styleUrls: ['../../ontimize.scss', '../../theme.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OntimizeWebComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
