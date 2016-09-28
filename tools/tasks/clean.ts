import * as async from 'async';
import * as util from 'gulp-util';
import * as chalk from 'chalk';
import * as del from 'del';
import {join} from 'path';
import {APP_DEST, TEST_DEST, TMP_DIR, OUT_DIR} from '../config';

export = function clean(gulp:any, plugins:any, option:any) {
  return function (done:any) {

    switch(option) {
      case 'all'    : cleanAll(done);     break;
      case 'dist'   : cleanDist(done);    break;
      case 'test'   : cleanTest(done);    break;
      case 'tmp'    : cleanTmp(done);     break;
      case 'out'    : cleanOut(done);     break;
      default: done();
    }

  };
};

function cleanAll(done:any) {
  async.parallel([
    cleanDist,
    cleanTest,
    cleanTmp,
    cleanOut
  ], done);
}
function cleanDist(done:any) {
  del(APP_DEST).then((paths) => {
    util.log('Deleted', chalk.yellow(paths && paths.join(', ') || '-'));
    done();
  });
}
function cleanTest(done:any) {
  del(TEST_DEST).then((paths) => {
    util.log('Deleted', chalk.yellow(paths && paths.join(', ') || '-'));
    done();
  });
}
function cleanTmp(done:any) {
  del(TMP_DIR).then((paths) => {
    util.log('Deleted', chalk.yellow(paths && paths.join(', ') || '-'));
    done();
  });
}
function cleanOut(done:any) {
  del([
    join(OUT_DIR, 'ontimize/**'),
    join(OUT_DIR, '**/*.*'),
    '!' + join(OUT_DIR, '.git'),
    '!' + join(OUT_DIR, '.gitignore')
  ]).then((paths) => {
    /*util.log('Deleted', chalk.yellow(paths && paths.join(', ') || '-'));*/
    done();
  });
}

