/// <reference path="../manual_typings/open.d.ts" />

import * as util from 'gulp-util';
import * as express from 'express';
import * as openResource from 'open';
import * as codeChangeTool from './code_change_tools';
import {APP_BASE, APP_DEST, PORT} from '../config';

export function serveSPA() {
  let server = express();
  codeChangeTool.listen();
  server.use.apply(server, codeChangeTool.middleware);

  server.listen(PORT, () => {
    util.log('Server is listening on port: ' + PORT);
    openResource('http://localhost:' + PORT + APP_BASE + APP_DEST);
  });
}

export function notifyLiveReload(e:any) {
  let fileName = e.path;
  codeChangeTool.changed(fileName);
}

