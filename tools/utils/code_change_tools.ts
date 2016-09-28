import * as express from 'express';
import * as connectLivereload from 'connect-livereload';
import { LIVE_RELOAD_PORT, APP_BASE} from '../config';
import * as tinylrFn from 'tiny-lr';

let tinylr = tinylrFn();
let listen = () => {
    return tinylr.listen(LIVE_RELOAD_PORT);
};

let changed = (files:any) => {
  if (!(files instanceof Array)) {
    files = [files];
  }
    tinylr.changed({
      body: { files }
    });
};

let tinylrMiddleware = connectLivereload({ port: LIVE_RELOAD_PORT });
let middleware = [
  APP_BASE,
  (req:any, res:any, next:any) => {
      tinylrMiddleware(req, res, next);
  },
  express.static(process.cwd())
];

export { listen, changed, middleware };
