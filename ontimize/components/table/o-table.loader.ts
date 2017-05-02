import * as $ from 'jquery';
// declare function require(name: string);
require('jquery');
//TODO NOT WORKS WITH NG2 2.0.0 (window as any).JSZip = require('jszip');
// TODO: require pdfmake from node_modules if files are available at its build directory
//(window as any).pdfMake = require('pdfmake/build/pdfmake.min.js');
//require('pdfmake/build/vfs_fonts.js');
(window as any).pdfMake = require('./vendor/pdfmake.min.js');
require('./vendor/vfs_fonts.js');
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

// added custom methods to order timestamps
($ as any).fn.dataTableExt.oSort['timestamp-asc']  = function(x, y) {
  let result = undefined;
  if ((x.indexOf('data-order') !== -1) && (y.indexOf('data-order') !== -1)) {
    let tmpx = x.substr(x.indexOf('data-order') + 12);
    tmpx = tmpx.substr(0, tmpx.indexOf('"'));
    tmpx = parseFloat(tmpx);
    let tmpy = y.substr(y.indexOf('data-order') + 12);
    tmpy = tmpy.substr(0, tmpy.indexOf('"'));
    tmpy = parseFloat(tmpy);
    result = ((tmpx < tmpy) ? -1 : ((tmpx > tmpy) ?  1 : 0));
  } else {
    result = ((x < y) ? -1 : ((x > y) ?  1 : 0));
  }
  return result;
};
($ as any).fn.dataTableExt.oSort['timestamp-desc'] = function(x, y) {
  let result = undefined;
  if ((x.indexOf('data-order') !== -1) && (y.indexOf('data-order') !== -1)) {
    let tmpx = x.substr(x.indexOf('data-order') + 12);
    tmpx = tmpx.substr(0, tmpx.indexOf('"'));
    tmpx = parseFloat(tmpx);
    let tmpy = y.substr(y.indexOf('data-order') + 12);
    tmpy = tmpy.substr(0, tmpy.indexOf('"'));
    tmpy = parseFloat(tmpy);
    result = ((tmpx < tmpy) ? 1 : ((tmpx > tmpy) ?  -1 : 0));
  } else {
    result = ((x < y) ? 1 : ((x > y) ?  -1 : 0));
  }
  return result;
};

// turn on/off sorting capability
($ as any).fn.dataTableExt.oApi.fnSortOnOff = function(oSettings, aiColumns, bOn) {
  let cols = ((typeof aiColumns === 'string') && (aiColumns === '_all')) ? oSettings.aoColumns : aiColumns;
  for (let i = 0, len = cols.length; i < len; ++i) {
    oSettings.aoColumns[i].bSortable = bOn;
  }
};
