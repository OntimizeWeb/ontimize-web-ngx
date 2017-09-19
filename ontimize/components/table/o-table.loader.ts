import * as $ from 'jquery';
// declare function require(name: string);
require('jquery');
window['$'] = window['jQuery'] = $;
//TODO NOT WORKS WITH NG2 2.0.0 (window as any).JSZip = require('jszip');
// TODO: require pdfmake from node_modules if files are available at its build directory

// requiring this files in angular-cli.json scripts (from node_modules)
//(window as any).pdfMake = require('pdfmake/build/pdfmake.min.js');
// require('./vendor/vfs_fonts.js');
require('datatables.net');
require('datatables.net-buttons');
require('datatables.net-buttons/js/buttons.colVis.js');
require('datatables.net-buttons/js/buttons.html5.js');
require('datatables.net-buttons/js/buttons.print.js');
require('datatables.net-colreorder');
require('./vendor/custom.dataTables.fixedHeader.js');
require('datatables.net-select');
require('./vendor/custom.dataTables.keyTable.js');
require('colresizable/colResizable-1.6.min.js');

// turn on/off sorting capability
($ as any).fn.dataTableExt.oApi.fnSortOnOff = function (oSettings, aiColumns, bOn) {
  let cols = ((typeof aiColumns === 'string') && (aiColumns === '_all')) ? oSettings.aoColumns : aiColumns;
  for (let i = 0, len = cols.length; i < len; ++i) {
    oSettings.aoColumns[i].bSortable = bOn;
  }
};
