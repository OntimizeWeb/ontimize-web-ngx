import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'lib-ontimize-web-ngx',
  template: `
    <p>
      ontimize-web-ngx works!
    </p>
  `,
  styleUrls: ['../../ontimize.scss', '../../theme.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OntimizeWebNgxComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
